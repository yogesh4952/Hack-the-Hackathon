import { _optionalChain } from '@sentry/core';
import * as prismaInstrumentation from '@prisma/instrumentation';
import { defineIntegration, spanToJSON, SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN } from '@sentry/core';
import { generateInstrumentOnce } from '../../otel/instrument.js';

const INTEGRATION_NAME = 'Prisma';

const instrumentPrisma = generateInstrumentOnce(
  INTEGRATION_NAME,
  options => {
    // Use a passed instrumentation instance to support older Prisma versions
    if (_optionalChain([options, 'optionalAccess', _ => _.prismaInstrumentation])) {
      return options.prismaInstrumentation;
    }

    const EsmInteropPrismaInstrumentation =
      // @ts-expect-error We need to do the following for interop reasons
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      _optionalChain([prismaInstrumentation, 'access', _2 => _2.default, 'optionalAccess', _3 => _3.PrismaInstrumentation]) || prismaInstrumentation.PrismaInstrumentation;

    return new EsmInteropPrismaInstrumentation({});
  },
);

/**
 * Adds Sentry tracing instrumentation for the [Prisma](https://www.npmjs.com/package/prisma) ORM.
 * For more information, see the [`prismaIntegration` documentation](https://docs.sentry.io/platforms/javascript/guides/node/configuration/integrations/prisma/).
 *
 * Make sure `previewFeatures = ["tracing"]` is added to the generator block in your Prisma schema.
 *
 * ```prisma
 * generator client {
 *  provider = "prisma-client-js"
 *  previewFeatures = ["tracing"]
 * }
 * ```
 *
 * NOTE: By default, this integration works with Prisma version 5.
 * To get performance instrumentation for other Prisma versions,
 * 1. Install the `@prisma/instrumentation` package with the desired version.
 * 1. Pass a `new PrismaInstrumentation()` instance as exported from `@prisma/instrumentation` to the `prismaInstrumentation` option of this integration:
 *
 *    ```js
 *    import { PrismaInstrumentation } from '@prisma/instrumentation'
 *
 *    Sentry.init({
 *      integrations: [
 *        prismaIntegration({
 *          // Override the default instrumentation that Sentry uses
 *          prismaInstrumentation: new PrismaInstrumentation()
 *        })
 *      ]
 *    })
 *    ```
 *
 *    The passed instrumentation instance will override the default instrumentation instance the integration would use, while the `prismaIntegration` will still ensure data compatibility for the various Prisma versions.
 */
const prismaIntegration = defineIntegration(
  ({
    prismaInstrumentation,
  }

 = {}) => {
    return {
      name: INTEGRATION_NAME,
      setupOnce() {
        instrumentPrisma({ prismaInstrumentation });
      },
      setup(client) {
        client.on('spanStart', span => {
          const spanJSON = spanToJSON(span);
          if (_optionalChain([spanJSON, 'access', _4 => _4.description, 'optionalAccess', _5 => _5.startsWith, 'call', _6 => _6('prisma:')])) {
            span.setAttribute(SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN, 'auto.db.otel.prisma');
          }

          // Make sure we use the query text as the span name, for ex. SELECT * FROM "User" WHERE "id" = $1
          if (spanJSON.description === 'prisma:engine:db_query' && _optionalChain([spanJSON, 'access', _7 => _7.data, 'optionalAccess', _8 => _8['db.query.text']])) {
            span.updateName(spanJSON.data['db.query.text'] );
          }

          // In Prisma v5.22+, the `db.system` attribute is automatically set
          // On older versions, this is missing, so we add it here
          if (spanJSON.description === 'prisma:engine:db_query' && !_optionalChain([spanJSON, 'access', _9 => _9.data, 'optionalAccess', _10 => _10['db.system']])) {
            span.setAttribute('db.system', 'prisma');
          }
        });
      },
    };
  },
);

export { instrumentPrisma, prismaIntegration };
//# sourceMappingURL=prisma.js.map

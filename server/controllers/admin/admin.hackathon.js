import { dataloaderIntegration } from '@sentry/node';
import Admin from '../../models/admin.models.js';
import Hackathon from '../../models/hackathon.models.js';

export const createHackathon = async (req, res) => {
  try {
    const { name, description, startDate, endDate, prizes } = req.body; // Change 'title' to 'name' and 'prize' to 'prizes'

    let organizer = req.body.userId;

    const hackathon = new Hackathon({
      name, // Use 'name' instead of 'title'
      description,
      startDate,
      endDate,
      prizes, // Use 'prizes' instead of 'prize'
      location: 'Shankhamul',
      organizer,
    });

    if (Date.now() > endDate) {
      hackathon.status = 'closed';
    } else if (Date.now() >= startDate && Date.now() <= endDate) {
      hackathon.status = 'open';
    } else {
      hackathon.status = 'upcoming';
    }

    await hackathon.save();
    return res.json({
      success: true,
      message: 'Hackathon created successfully.',
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      message: 'Server error.',
      success: false,
      error: error.message,
    });
  }
};

// export const CreatedgetHackathonById = async (req, res) => {
//   try {
//     const hackathon = await Hackathon.findById(req.params.id).populate(
//       'organizer',
//       'name email'
//     );

//     if (!hackathon) {
//       return res.status(404).json({
//         message: 'Hackathon not found.',
//         success: false,
//       });
//     }

//     return res.json({
//       success: true,
//       hackathon,
//     });
//   } catch (error) {
//     console.error(error.message);
//     return res.status(500).json({
//       message: 'Server error.',
//       success: false,
//       error: error.message,
//     });
//   }
// };

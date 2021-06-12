import { getLinkPreview as getLinkPreviewLibrary } from 'link-preview-js';
import { validateURL } from '../helpers/validation';

export default class UtilsController {
  getLinkPreview = async (req, res) => {
    const { url } = req.query;

    // Validating request body
    try {
      validateURL(url, 'url', true);
    } catch (err) {
      return res.badRequest(err.message);
    }

    let data;
    try {
      data = await getLinkPreviewLibrary(url);
    } catch (err) {
      return res.badRequest('Unable to get link preview');
    }

    res.status(200).json({ data });
  };
}

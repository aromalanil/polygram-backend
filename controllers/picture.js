import Picture from '../models/picture';

export default class PictureController {
  getPicture = async (req, res) => {
    const { id } = req.params;

    const picture = await Picture.findById(id).select('data content_type').lean();

    if (!picture) {
      return res.notFound('Picture not found');
    }

    const { data, content_type } = picture;
    const image = Buffer.from(data, 'base64');

    res.set('Content-Type', content_type);
    res.set('Content-Length', image.length);
    res.send(image);
  };
}

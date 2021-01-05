import { Request, Response } from 'express';

import { container } from 'tsyringe';
import GenerateOgtagService from '../services/GenerateOgtagService';
import GetHtmlOgtagService from '../services/GetHtmlOgtagService';

export default class OgtagController {
  public async index(request: Request, response: Response): Promise<Response> {
    try {
      const { hash } = request.params;

      const getOgtag = container.resolve(GetHtmlOgtagService);

      const ogtag = await getOgtag.execute(hash);
      console.log('OG', ogtag);

      response.writeHead(200, {
        'Content-Type': 'text/html',
      });
      response.write(
        `${
          '<!DOCTYPE html>' +
          '<html lang="pt-br">' +
          '<head>' +
          '<meta charset="UTF-8">' +
          '<meta name="viewport" content="width=device-width, initial-scale=1.0">' +
          '<title>Titulo</title>' +
          '<meta property="og:title" content="Rivan Wup" />' +
          '<meta property="og:description" content="'
        }${ogtag?.description}" />` +
          `<meta property="og:image" content="${ogtag?.image}" />` +
          `</head>` +
          `<body>` +
          `</body>` +
          '<script>' +
          'setTimeout(function() {' +
          'window.location.replace("http://whatever.com/newpage.html")' +
          '}, 2000);' +
          '</script>' +
          `</html>`,
      );
      response.end();
      return response;
    } catch (error) {
      return response.status(400).json({ error: error.message });
    }
  }

  public async create(request: Request, response: Response): Promise<Response> {
    try {
      // const { token } = request.params; // todo

      const { url, description, image, title } = request.body;

      const service = container.resolve(GenerateOgtagService);

      const hash = await service.execute({ url, image, title, description });

      return response.json({ url: `http://localhost:3337/${hash}` });
    } catch (error) {
      return response.status(400).json({ error: error.message });
    }
  }
}
import dotenv from 'dotenv';
dotenv.config();

import express, { Request as ExpressRequest, NextFunction, Response } from 'express';
import ViteExpress from 'vite-express';
import axios from 'axios';

interface PageMetadata {
  title?: string;
  imageUrl?: string;
  iconUrl?: string;
  description?: string;
}

interface Request extends ExpressRequest {
  metadata?: PageMetadata;
}

const DEFAULT_METADATA: PageMetadata = {
  title: 'VenomDrop',
  imageUrl: '', // TODO: Use a default cover image url here
  description: '', // TODO: add a description URL here
}

const DROP_PAGE_PATH_REGEX = /^\/collections\/([a-zA-Z-0-9-]+)$/;

/**
 * Check if the current page is a Drop Page and generate a metadata for sharing.
 * Otherwise it returns a default VenomDrop metadata.
 * @param req express Request
 * @returns 
 */
const getMetadata = async (req: Request): Promise<PageMetadata> => {
  try {    
    const match = DROP_PAGE_PATH_REGEX.exec(req.path);
    if (!match) {
      return DEFAULT_METADATA;
    }
    const slug = match[1];
    if (slug) {
      const { data: collection } = await axios.get(`${process.env.VITE_API_BASE_URL}/collections/${slug}`);
      return {
        title: `${collection?.name} - Drop Page`,
        imageUrl: collection?.coverImageSrc,
        description: collection?.description,
      }
    }
  // eslint-disable-next-line no-empty
  } catch (error) {}
  return DEFAULT_METADATA;
}

const app = express();

const MetadataMiddleware = async (req: Request, _res: Response, next: NextFunction) => {
  req.metadata = await getMetadata(req);
  next();
};

app.use(MetadataMiddleware);

const transformer = (html: string, req: Request) => {
  const { title, imageUrl, description } = (req.metadata || DEFAULT_METADATA);
  const header = [
    `<meta property="og:title" content="${title}" />`,
    `<meta property="og:image" content="${imageUrl}" />`,
    `<meta property="og:description" content="${description}" />`,
    `<meta name="description" content="${description}">`,
    `<title>${title}</title>`,
  ];
  return html.replace(
     '<!--extra-head-placeholder-->', 
     header.join('\n'),
  )
}

ViteExpress.config({ transformer });
ViteExpress.listen(app, 5173, () => console.log("Server is listening on http://127.0.0.1:5173"));

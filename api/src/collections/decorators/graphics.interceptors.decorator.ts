import {
  applyDecorators,
  CallHandler,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NestInterceptor,
  NotFoundException,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { randomUUID } from 'crypto';
import { Request } from 'express';
import * as multerS3 from 'multer-s3';
import { Observable } from 'rxjs';
import { s3 } from 'src/common/libs/s3';
import { PrismaService } from 'src/prisma.service';

const GRAPHICS_KEY = 'uploads/graphics';

const ALLOWED_GRAPHIC_MIMETYPE_EXTENSIONS: {
  [key: string]: string | undefined;
} = {
  'image/jpeg': 'jpeg',
  'image/png': 'png',
  'image/webp': 'webp',
};

const generateFileKey = (file: Express.Multer.File): string => {
  const uuid = randomUUID();
  const ext = ALLOWED_GRAPHIC_MIMETYPE_EXTENSIONS[file.mimetype];
  const filename = `${file.fieldname}_${uuid}.${ext}`;
  return `${GRAPHICS_KEY}/${filename}`;
};

@Injectable()
export class CheckCollectionOwnedByLoggedAccount implements NestInterceptor {
  constructor(private readonly prismaService: PrismaService) {}
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest() as Request & {
      user: { id: string };
    };
    const slug = req.params.slug;
    const collection = await this.prismaService.collection.findFirst({
      where: {
        slug,
      },
    });
    if (!collection) {
      throw new NotFoundException();
    }
    if (collection.ownerId !== req.user.id) {
      throw new ForbiddenException();
    }
    return next.handle();
  }
}

export function GraphicsInterceptors() {
  return applyDecorators(
    UseInterceptors(
      CheckCollectionOwnedByLoggedAccount,
      FileFieldsInterceptor(
        [
          { name: 'logo', maxCount: 1 },
          { name: 'cover', maxCount: 1 },
          { name: 'featured', maxCount: 1 },
        ],
        {
          limits: {
            fileSize: 20000000,
          },
          fileFilter(req, file, cb) {
            console.log(file);
            const ext = ALLOWED_GRAPHIC_MIMETYPE_EXTENSIONS[file.mimetype];
            const isValid = !!ext;
            cb(null, isValid);
          },
          storage: multerS3({
            s3,
            bucket: process.env.AWS_S3_BUCKET_NAME!,
            acl(req, file, callback) {
              callback(null, 'public-read');
            },
            metadata: function (req, file, cb) {
              cb(null, { fieldName: file.fieldname });
            },
            key: function (req, file, cb) {
              const key = generateFileKey(file);
              console.log(key);
              cb(null, key);
            },
          }),
        },
      ),
    ),
  );
}

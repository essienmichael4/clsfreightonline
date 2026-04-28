import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpCode, HttpStatus, UseInterceptors, Req, UploadedFiles, ParseFilePipeBuilder, BadRequestException, Query } from '@nestjs/common';
import { StoresService } from './stores.service';
import { JwtGuard } from 'src/guards/jwt.guard';
import { ApiBearerAuth, ApiConsumes, ApiCreatedResponse, ApiForbiddenResponse, ApiInternalServerErrorResponse, ApiOkResponse, ApiOperation, ApiUnprocessableEntityResponse } from '@nestjs/swagger';
import { User, UserInfo } from 'src/decorators/user.decorator';
import { CreateProductDto } from './dto/create-product.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import {uuid} from 'uuidv4'
import { UploadService } from 'src/upload/upload.service';

@Controller('stores')
export class StoresController {
  constructor(private readonly storesService: StoresService, private readonly uploadService:UploadService) {}

  @UseGuards(JwtGuard)
  @Post('products')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({type: "", description: "Product created successfully"})
  @ApiOkResponse({type: "", description: "Product created successfully"})
  @ApiOperation({description: "Create Product api"})
  @ApiConsumes("application/json")
  createProduct(@Body() createProductDto: CreateProductDto, @User() user:UserInfo) {
    return this.storesService.createProduct(user.sub.id, createProductDto);
  }

  @UseGuards(JwtGuard)
  @Post('products/:id/uploads')
  @ApiForbiddenResponse({description: 'UNAUTHORIZED_REQUEST'})
  @ApiUnprocessableEntityResponse({description: 'BAD_REQUEST'})
  @ApiInternalServerErrorResponse({description: 'INTERNAL_SERVER_ERROR'})
  @UseInterceptors(FilesInterceptor('files'))
  async uploadImages(
    @Param('id') id: string,
    @Req() req: any,
    @UploadedFiles(
      new ParseFilePipeBuilder().
        addMaxSizeValidator({ maxSize: 3 * 1024 * 1024 })
        .build({ errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY }),
    ) files: Array<Express.Multer.File>,
  ) {
    if (!files?.length) throw new BadRequestException('No files uploaded');

    // Upload each file — uploadProduct() now returns the permanent public URL
    const filenames: string[] = [];
    for (const file of files) {
      const filename = `${uuid()}-${file.originalname.replace(/\s+/g, '')}`;
      await this.uploadService.addProductImage(file.buffer, filename);
      filenames.push(filename); // store filename only
    }

    // Append to existing images and save
    const rawProduct = await this.storesService.findRaw(id);
    const existingFilenames = rawProduct?.images ?? [];
    const merged = [...existingFilenames, ...filenames];
    await this.storesService.update(id, { images: merged } as any);

    const urls = await Promise.all(
      filenames.map(f => this.uploadService.getThumbnailSignedUrl(f))
    )

    return { uploaded: filenames, urls, images: merged };
  }


  @Get("products")
  @ApiOperation({ summary: 'List products with filters and pagination' })
  findAll(@Query() query: any) {
    return this.storesService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single product by ID' })
  findOne(@Param('id') id: string) {
    return this.storesService.findOne(id);
  }

  @Patch('products/:id')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update product (admin)' })
  update(@Param('id') id: string, @Body() dto: any) {
    const { images, ...safeDto } = dto;
    return this.storesService.update(id, safeDto);
  }

  
  @Delete('products/:id')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Archive product (admin)' })
  remove(@Param('id') id: string) {
    return this.storesService.softDelete(id);
  }
}

import { PageMetaDtoParamenters } from "./pageMetaDtoParameters.dto";

export class PageMetaDto {
    readonly page: number

    readonly take: number

    readonly itemCount: number
    
    readonly pageCount: number
    
    readonly hasPreviousPage: boolean
    
    readonly hasNextPage: boolean

    constructor({pageOptionsDto, itemCount}: PageMetaDtoParamenters){
        this.page = pageOptionsDto.page
        this.take = pageOptionsDto.take
        this.itemCount = itemCount
        this.pageCount = Math.ceil(this.itemCount / this.take);
        this.hasPreviousPage = this.page > 1;
        this.hasNextPage = this.page < this.pageCount;
    }
}

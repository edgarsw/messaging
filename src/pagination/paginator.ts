import { Expose } from "class-transformer";
import { SelectQueryBuilder } from "typeorm";

export interface PaginateOptions {
  limit: number;
  currentPage: number;
  total?: boolean;
}

export class PaginationResult<T> {
  constructor(partial: Partial<PaginationResult<T>>) {
    Object.assign(this, partial);
  }

  @Expose()
  first: number;

  @Expose()
  last: number;

  @Expose()
  limit: number;

  @Expose()
  total?: number;

  @Expose()
  totalPages?: number;
}

export async function paginate<T>(
  qb: SelectQueryBuilder<T>,
  options: PaginateOptions = {
    limit: 10,
    currentPage: 1,
  }
): Promise<{ status: string, data: T[], pagination: PaginationResult<T>, message: string, error?: { code: number, message: string } }> {
  try {
    const offset = (options.currentPage - 1) * options.limit;

     // Ver el query SQL generado
    //  const sql = qb.limit(options.limit).offset(offset).getSql();
    //  console.log("Generated SQL Query:", sql);
     
    const [data, total] = await Promise.all([
      qb.limit(options.limit).offset(offset).getMany(),
      options.total ? qb.getCount() : Promise.resolve(null)
    ]);

    const paginationResult = new PaginationResult({
      first: offset + 1,
      last: offset + data.length,
      limit: options.limit,
      total: total || data.length,
      totalPages: total ? Math.ceil(total / options.limit) : 1
    });

    return {
      status: "success",
      data,
      pagination: paginationResult,
      message: "Resources fetched successfully"
    };
  } catch (error) {
    return {
      status: "error",
      data: [],
      pagination: null,
      message: "An unexpected error occurred",
      error: {
        code: error.status || 500,
        message: error.message
      }
    };
  }
}

export async function paginateInverse<T>(
  qb: SelectQueryBuilder<T>,
  options: PaginateOptions = {
    limit: 10,
    currentPage: 1,
  }
): Promise<{ status: string, data: T[], pagination: PaginationResult<T>, message: string, error?: { code: number, message: string } }> {
  try {
     // Obtener el total de registros
     const total = await qb.getCount();

     // Calcular el número total de páginas
     const totalPages = Math.ceil(total / options.limit);
 
     // Calcular el offset de manera inversa
     const offset = (totalPages - options.currentPage) * options.limit;
 
     // Obtener los datos con el nuevo offset
     const data = await qb.limit(options.limit).offset(Math.max(0, offset)).getMany();
 
     const paginationResult = new PaginationResult({
       first: offset + 1,
       last: offset + data.length,
       limit: options.limit,
       total,
       totalPages
     });

    return {
      status: "success",
      data,
      pagination: paginationResult,
      message: "Resources fetched successfully"
    };
  } catch (error) {
    return {
      status: "error",
      data: [],
      pagination: null,
      message: "An unexpected error occurred",
      error: {
        code: error.status || 500,
        message: error.message
      }
    };
  }
}

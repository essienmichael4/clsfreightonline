declare namespace NodeJS {
    export interface ProcessEnv{
        DB_HOST:string
        DB_PORT:string
        DB_USERNAME:string
        DB_PASSWORD:string
        DB_NAME:string

        JWT_SECRET_KEY:string
        JWT_REFRESH_KEY:string
    }
}
import { Injectable } from '@nestjs/common';

@Injectable()
export class UtilsService {
    extractUrl(field: string) {
        const regex = /<([^>]*)>; rel="next"/;
        const match = regex.exec(field);
    
        // A URL estará no grupo de captura (índice 1)
        if (match && match[1]) {
            const nextUrl = match[1];
            return nextUrl;
        } else {
            return null;
        }
    }
}


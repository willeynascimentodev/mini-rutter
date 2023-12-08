export class OrderInterface {
    plataform_id: string
    lineItems: { product_id: string | null }[];
}
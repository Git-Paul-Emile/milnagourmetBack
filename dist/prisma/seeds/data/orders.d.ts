export declare const ordersData: ({
    id: string;
    userId: string;
    customerName: string;
    customerPhone: string;
    customerAddress: string;
    status: string;
    totalAmount: number;
    deliveryFee: number;
    notes: string;
    createdAt: string;
    updatedAt: string;
    deliveryZoneId: string;
    deliveryPersonId: string;
    items: {
        productId: string;
        quantity: number;
        price: number;
    }[];
    customCreations: {
        sizeId: string;
        quantity: number;
        price: number;
        fruits: string[];
        sauces: string[];
        cereales: string[];
    }[];
} | {
    id: string;
    userId: string;
    customerName: string;
    customerPhone: string;
    customerAddress: string;
    status: string;
    totalAmount: number;
    deliveryFee: number;
    notes: string;
    createdAt: string;
    updatedAt: string;
    deliveryZoneId: string;
    items: {
        productId: string;
        quantity: number;
        price: number;
    }[];
    customCreations: {
        sizeId: string;
        quantity: number;
        price: number;
        fruits: string[];
        sauces: string[];
        cereales: string[];
    }[];
    deliveryPersonId?: undefined;
})[];
//# sourceMappingURL=orders.d.ts.map
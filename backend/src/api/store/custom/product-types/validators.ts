import { createSelectParams, createFindParams } from '@medusajs/medusa/api/utils/validators';

export const AdminGetProductTypeParams: ReturnType<typeof createSelectParams> = createSelectParams();

export const AdminGetProductTypesParams: ReturnType<typeof createFindParams> = createFindParams();

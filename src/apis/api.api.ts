import { isSuccess } from './util';
import { SwaggerV3Api } from './swagger/swagger.api';

export const Api = {
  isSuccess,
  SwaggerV3Api: new SwaggerV3Api()
};

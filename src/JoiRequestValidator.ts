import * as joi from "joi";
import { Request } from "express";

interface JoiRequestValidatorResponse {
  error?: string;
}

interface JoiRouteValidator {
  route: string;
  method: string;
  validatorSchema: joi.ObjectSchema<any>;
}

const postBodyFormat = joi.object({
  name: joi.string().min(3).max(30).required(),
  description: joi.string().min(3).max(200),
  price: joi.number().min(0).required(),
});

const putBodyFormat = joi
  .object({
    name: joi.string().min(3).max(30),
    description: joi.string().min(3).max(200),
    price: joi.number().min(0),
  })
  .or("name", "description", "price");

class JoiRequestValidator {
  validators: JoiRouteValidator[] = [
    {
      route: "/conversations/:id",
      method: "POST",
      validatorSchema: postBodyFormat,
    },
    {
      route: "/conversations/:id",
      method: "PUT",
      validatorSchema: putBodyFormat,
    },
  ];

  validate(request: Request): JoiRequestValidatorResponse {
    const route = request.route?.path || "";
    const method = request.method || "";

    const validator = this.validators.find(
      (v) => v.route === route && v.method === method
    );

    if (!validator) {
      return {};
    }

    const validationResult = validator.validatorSchema.validate(request.body, {
      abortEarly: false,
    });

    if (!validationResult.error) {
      return {};
    }

    const errorDetails = validationResult.error.details.map(
      (detail) => detail.message
    );

    return { error: errorDetails.join(", ") };
  }
}

export const JoiRequestValidatorInstance = new JoiRequestValidator();

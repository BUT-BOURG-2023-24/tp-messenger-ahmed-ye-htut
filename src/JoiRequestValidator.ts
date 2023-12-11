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

const postBodyFormatForConversation = joi.object({
  title: joi.string().min(3).max(30).required(),
  participants: joi.array().items(joi.string().length(24)).required(),
});

const putBodyFormatForConversation = joi
  .object({
    title: joi.string().min(3).max(30),
    participants: joi.array().items(joi.string().length(24)),
  })
  .or("title", "participants");

const putSeenBodyFormat = joi.object({
  conversationId: joi.string().length(24).required(),
  userId: joi.string().length(24).required(),
  messageId: joi.string().length(24).required(),
});

const postUserBodyFormatForUser = joi.object({
  username: joi.string().min(3).max(30).required(),
  password: joi.string().min(6).required(), // Adjust the min length as needed
});

class JoiRequestValidator {
  validators: JoiRouteValidator[] = [
    {
      route: "/conversations/:id",
      method: "POST",
      validatorSchema: postBodyFormatForConversation,
    },
    {
      route: "/conversations/:id",
      method: "PUT",
      validatorSchema: putBodyFormatForConversation,
    },
    {
      route: "/conversations/:id",
      method: "PUT",
      validatorSchema: putSeenBodyFormat,
    },
    {
      route: "/users", // Update the route as needed
      method: "POST",
      validatorSchema: postUserBodyFormatForUser,
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

import { BaseApplicationEntity } from "#/domain/entities/ApplicationEntity";
import { QueryDTO } from "@sharemyride/shared";

export type GetApplicationsQueryRequest = QueryDTO<BaseApplicationEntity>;

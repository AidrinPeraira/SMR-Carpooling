import { ApplicationEntity } from "#/domain/entities/ApplicationEntity";
import { QueryDTO } from "@sharemyride/shared";

export type GetApplicationsQueryRequest = QueryDTO<ApplicationEntity>;

"use client";

import { Filter } from "@/components/UserInput/Filter";
import { InlineError } from "@/components/InlineError";
import { Pagination } from "@/components/UserInput/Pagination";
import { Search } from "@/components/UserInput/Search";
import { Sort } from "@/components/UserInput/Sort";
import { getAllUsersRequest } from "@/features/admin/users/api/requests/getAllUsersRequest";
import { GetAllUsersResult, QueryDTO, SortOrder, UserRole } from "@smr/shared";
import { Button, Loader, Table, TableProps, Tag } from "@smr/ui";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

export default function AdminUsersView() {
  const existingParams = useSearchParams();

  //lets craft the query from any params that exist

  const searchValue = existingParams.get("search") || "";
  const filterField = existingParams.get("filterField");
  const filterValue = existingParams.get("filterValue");
  const sortField = existingParams.get("sortField");
  const sortValue = existingParams.get("sortValue");

  const page = existingParams.get("page") || "1";
  const limit = existingParams.get("limit") || "10";

  /**
   * This object is crafted using use memo.
   * It prevernts unwanted re renders when the query object is used as props
   */
  //creaft the query oobject and then we make the request
  const queryParams: Record<string, string> = useMemo(() => {
    const query: Partial<Record<keyof QueryDTO<GetAllUsersResult>, string>> =
      {};

    if (searchValue) {
      query.search = searchValue;
    }

    if (
      filterField &&
      filterValue &&
      filterField !== "None" &&
      filterValue !== "None"
    ) {
      query.filterField = filterField;
      query.filterValue = filterValue;
    }

    if (sortField) {
      query.sortField = sortField;

      if (sortValue) {
        query.sortValue = sortValue;
      } else {
        query.sortValue = SortOrder.ASC;
      }
    }

    query.page = page;
    query.limit = limit;

    return query;
  }, [
    searchValue,
    filterField,
    filterValue,
    sortField,
    sortValue,
    page,
    limit,
  ]);

  const { isPending, error, data } = useQuery({
    queryKey: ["allUsers", queryParams],
    queryFn: async () => {
      return await getAllUsersRequest(queryParams);
    },
    placeholderData: keepPreviousData,
    staleTime: 60 * 10,
    gcTime: 60 * 10,
  });

  //loading screen while fetching data
  if (isPending) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  //return different component in case requestr fails
  if (error) {
    return (
      <InlineError message={`Some error occured : ${error}`}></InlineError>
    );
  }

  if (!data.success || !data.payload) {
    return (
      <InlineError
        message={`Some response error occured : ${data.message}`}
      ></InlineError>
    );
  }

  //we create the data needed for the different table components here
  const tableData: TableProps<GetAllUsersResult> = {
    data: data.payload.data ?? [],
    columnNames: [
      {
        headerName: "First Name",
        fieldName: "first_name",
      },
      {
        headerName: "Last Name",
        fieldName: "last_name",
      },
      {
        headerName: "Email",
        fieldName: "email_id",
      },
      {
        headerName: "Account Status",
        fieldName: "account_status",
        customRender: (value) => {
          return <Tag>{String(value).toLocaleUpperCase()}</Tag>;
        },
      },
      {
        headerName: "Role",
        fieldName: "user_role",
        customRender: (value) => {
          return <Tag variant="accent">{String(value).toUpperCase()}</Tag>;
        },
      },
      {
        headerName: "Action",
        customRender: () => {
          return (
            <Button variant="ghost" className="text-xs">
              View Details
            </Button>
          );
        },
        align: "right",
      },
    ],
  };

  const filterFields = {
    AccountStatus: ["active", "blocked"],
    UserRole: [UserRole.ADMIN, UserRole.PASSENGER, UserRole.DRIVER],
  };

  const sortFields = ["userRole", "accountStatus", "createdAt"];

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-bold text-content-primary">
        User Management
      </h1>
      <div className="flex flex-wrap gap-4 items-center w-full justify-between">
        <div>
          <Search />
        </div>
        <div className="flex flex-col md:flex-row">
          <Filter filters={filterFields} />
          <Sort sortFields={sortFields} />
        </div>
      </div>
      <div className="overflow-x-auto">
        <Table columnNames={tableData.columnNames} data={tableData.data} />
      </div>
      <Pagination
        currentPage={data.payload.paginationMeta.currentPage}
        totalPages={data.payload.paginationMeta.totalPages}
      />
    </div>
  );
}

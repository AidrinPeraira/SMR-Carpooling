"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { VehicleListResponseAPI, VehicleTypes } from "@sharemyride/shared";
import {
  Button,
  Card,
  CardBody,
  DropDown,
  Input,
  Label,
  Table,
  TableProps,
  Tag,
  useToast,
} from "@sharemyride/ui";
import { createVehicleRequest } from "../api/requests/createVehicleRequest";
import { updateVehicleRequest } from "../api/requests/updateVehicleRequest";

interface AdminVehicleListTableProps {
  vehicles: VehicleListResponseAPI[];
}

export function AdminVehicleListTable({ vehicles }: AdminVehicleListTableProps) {
  const queryClient = useQueryClient();
  const toast = useToast();

  const [showAddForm, setShowAddForm] = useState(false);
  const [newVehicleType, setNewVehicleType] = useState<VehicleTypes>(
    VehicleTypes.SEDAN,
  );
  const [newVehicleMake, setNewVehicleMake] = useState("");
  const [newVehicleModel, setNewVehicleModel] = useState("");

  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      is_active,
    }: {
      id: string;
      is_active: boolean;
    }) => {
      return await updateVehicleRequest(id, { is_active });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminConfigurations"] });
      toast("Vehicle status updated", { variant: "success" });
    },
    onError: (err: unknown) => {
      toast(err instanceof Error ? err.message : "Failed to update vehicle", {
        variant: "error",
      });
    },
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      return await createVehicleRequest({
        vehicle_type: newVehicleType,
        vehicle_make: newVehicleMake.trim(),
        vehicle_model: newVehicleModel.trim(),
        is_active: true,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminConfigurations"] });
      toast("Vehicle model added successfully", { variant: "success" });
      setNewVehicleMake("");
      setNewVehicleModel("");
      setShowAddForm(false);
    },
    onError: (err: unknown) => {
      toast(err instanceof Error ? err.message : "Failed to add vehicle model", {
        variant: "error",
      });
    },
  });

  const handleAddVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVehicleMake.trim() || !newVehicleModel.trim()) {
      toast("Please fill out make and model fields", { variant: "error" });
      return;
    }
    createMutation.mutate();
  };

  const dropdownOptions = Object.values(VehicleTypes).map((vt) => ({
    label: vt.toUpperCase(),
    value: vt,
  }));

  const tableData: TableProps<VehicleListResponseAPI> = {
    data: vehicles,
    columnNames: [
      {
        headerName: "Type",
        fieldName: "vehicle_type",
        customRender: (val) => (
          <Tag variant="accent">{String(val).toUpperCase()}</Tag>
        ),
      },
      {
        headerName: "Make",
        fieldName: "vehicle_make",
      },
      {
        headerName: "Model",
        fieldName: "vehicle_model",
      },
      {
        headerName: "Status",
        fieldName: "is_active",
        customRender: (val) => (
          <Tag variant={val ? "accent" : "muted"}>
            {val ? "ACTIVE" : "INACTIVE"}
          </Tag>
        ),
      },
      {
        headerName: "Action",
        align: "right",
        customRender: (_val, row) => (
          <Button
            variant={row.is_active ? "secondary" : "primary"}
            className="text-xs py-1 px-2.5"
            disabled={updateMutation.isPending}
            onClick={() =>
              updateMutation.mutate({ id: row.id, is_active: !row.is_active })
            }
          >
            {row.is_active ? "Deactivate" : "Activate"}
          </Button>
        ),
      },
    ],
  };

  return (
    <section className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-xs font-semibold text-content-tertiary uppercase tracking-wider">
            Vehicle Database Management
          </h2>
          <p className="text-xs text-content-secondary mt-0.5">
            Manage supported vehicle makes and models across the system.
          </p>
        </div>

        <Button
          variant={showAddForm ? "secondary" : "primary"}
          className="text-xs py-1.5 self-start sm:self-auto"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? "Cancel" : "+ Add Vehicle Model"}
        </Button>
      </div>

      {showAddForm && (
        <Card className="overflow-visible">
          <CardBody className="space-y-3 mb-0">
            <h3 className="text-sm font-semibold text-content-primary">
              Register New Vehicle Model
            </h3>
            <form
              onSubmit={handleAddVehicle}
              className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end"
            >
              <div>
                <Label className="text-xs font-medium text-content-secondary mb-1">
                  Vehicle Type
                </Label>
                <div>
                  <DropDown
                    defaultValue={newVehicleType}
                    options={dropdownOptions}
                    onChange={(val) => setNewVehicleType(val as VehicleTypes)}
                  />
                </div>
              </div>

              <div>
                <Label className="text-xs font-medium text-content-secondary mb-1">
                  Make (e.g. Toyota)
                </Label>
                <Input
                  value={newVehicleMake}
                  onChange={(e) => setNewVehicleMake(e.target.value)}
                  placeholder="e.g. Toyota"
                />
              </div>

              <div>
                <Label className="text-xs font-medium text-content-secondary mb-1">
                  Model (e.g. Camry)
                </Label>
                <Input
                  value={newVehicleModel}
                  onChange={(e) => setNewVehicleModel(e.target.value)}
                  placeholder="e.g. Camry"
                />
              </div>

              <div className="md:col-span-3 flex justify-end gap-2">
                <Button
                  type="submit"
                  variant="primary"
                  className="text-xs py-1.5 px-4"
                  disabled={createMutation.isPending}
                >
                  {createMutation.isPending ? "Adding..." : "Save Vehicle Model"}
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
      )}

      <div className="overflow-x-auto">
        <Table columnNames={tableData.columnNames} data={tableData.data} />
      </div>
    </section>
  );
}

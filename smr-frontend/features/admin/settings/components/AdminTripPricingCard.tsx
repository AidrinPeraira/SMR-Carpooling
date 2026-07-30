"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PricingRuleResponseAPI, VehicleTypes } from "@sharemyride/shared";
import { Button, Card, CardBody, Input, Label, Tag, useToast } from "@sharemyride/ui";
import { updatePricingRuleRequest } from "../api/requests/updatePricingRuleRequest";
import { createPricingRuleRequest } from "../api/requests/createPricingRuleRequest";

interface AdminTripPricingCardProps {
  pricingRules: PricingRuleResponseAPI[];
}

const VEHICLE_TYPE_LABELS: Record<VehicleTypes, { label: string; defaultBase: number; defaultRate: number }> = {
  [VehicleTypes.SEDAN]: { label: "Economy (Sedan)", defaultBase: 50, defaultRate: 15 },
  [VehicleTypes.SUV]: { label: "Premium (SUV)", defaultBase: 75, defaultRate: 25 },
  [VehicleTypes.HATCHBACK]: { label: "Compact (Hatchback)", defaultBase: 40, defaultRate: 12 },
};

export function AdminTripPricingCard({ pricingRules }: AdminTripPricingCardProps) {
  const queryClient = useQueryClient();
  const toast = useToast();

  const [editingValues, setEditingValues] = useState<
    Record<string, { basePrice: string; pricePerKm: string }>
  >({});

  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      base_price,
      price_per_km,
    }: {
      id: string;
      base_price: number;
      price_per_km: number;
    }) => {
      return await updatePricingRuleRequest(id, { base_price, price_per_km });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminConfigurations"] });
      toast("Pricing rule updated successfully", { variant: "success" });
    },
    onError: (err: unknown) => {
      toast(err instanceof Error ? err.message : "Failed to update pricing rule", {
        variant: "error",
      });
    },
  });

  const createMutation = useMutation({
    mutationFn: async ({
      vehicle_type,
      base_price,
      price_per_km,
    }: {
      vehicle_type: VehicleTypes;
      base_price: number;
      price_per_km: number;
    }) => {
      return await createPricingRuleRequest({ vehicle_type, base_price, price_per_km });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminConfigurations"] });
      toast("Pricing rule created successfully", { variant: "success" });
    },
    onError: (err: unknown) => {
      toast(err instanceof Error ? err.message : "Failed to create pricing rule", {
        variant: "error",
      });
    },
  });

  const handleValueChange = (
    vType: string,
    field: "basePrice" | "pricePerKm",
    val: string,
  ) => {
    setEditingValues((prev) => ({
      ...prev,
      [vType]: {
        basePrice: prev[vType]?.basePrice ?? "",
        pricePerKm: prev[vType]?.pricePerKm ?? "",
        [field]: val,
      },
    }));
  };

  const handleSave = (vType: VehicleTypes) => {
    const existingRule = pricingRules.find((r) => r.vehicle_type === vType);
    const defaults = VEHICLE_TYPE_LABELS[vType];

    const currentValues = editingValues[vType] || {};
    const basePriceStr =
      currentValues.basePrice !== undefined && currentValues.basePrice !== ""
        ? currentValues.basePrice
        : String(existingRule?.base_price ?? defaults.defaultBase);
    const pricePerKmStr =
      currentValues.pricePerKm !== undefined && currentValues.pricePerKm !== ""
        ? currentValues.pricePerKm
        : String(existingRule?.price_per_km ?? defaults.defaultRate);

    const base_price = parseFloat(basePriceStr);
    const price_per_km = parseFloat(pricePerKmStr);

    if (isNaN(base_price) || isNaN(price_per_km)) {
      toast("Please enter valid numeric pricing values", { variant: "error" });
      return;
    }

    if (existingRule) {
      updateMutation.mutate({
        id: existingRule.id,
        base_price,
        price_per_km,
      });
    } else {
      createMutation.mutate({
        vehicle_type: vType,
        base_price,
        price_per_km,
      });
    }
  };

  const allVehicleTypes = Object.values(VehicleTypes) as VehicleTypes[];

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xs font-semibold text-content-tertiary uppercase tracking-wider">
            Ride Rates & Pricing Rules
          </h2>
          <p className="text-xs text-content-secondary mt-0.5">
            Configure base fare and distance rates (₹/km) by vehicle type.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {allVehicleTypes.map((vType) => {
          const configInfo = VEHICLE_TYPE_LABELS[vType] ?? {
            label: vType.toUpperCase(),
            defaultBase: 50,
            defaultRate: 15,
          };
          const rule = pricingRules.find((r) => r.vehicle_type === vType);

          const currentEditing = editingValues[vType];
          const basePriceValue =
            currentEditing?.basePrice ?? String(rule?.base_price ?? configInfo.defaultBase);
          const pricePerKmValue =
            currentEditing?.pricePerKm ?? String(rule?.price_per_km ?? configInfo.defaultRate);

          const isSaving = updateMutation.isPending || createMutation.isPending;

          return (
            <Card key={vType} className="flex flex-col justify-between">
              <CardBody className="space-y-3 mb-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-content-primary">
                    {configInfo.label}
                  </span>
                  {rule ? (
                    <Tag variant={rule.is_active ? "accent" : "muted"}>
                      {rule.is_active ? "Active" : "Inactive"}
                    </Tag>
                  ) : (
                    <Tag variant="muted">Not Configured</Tag>
                  )}
                </div>

                <div className="space-y-2">
                  <div>
                    <Label className="text-xs font-medium text-content-secondary mb-1">
                      Base Price (₹)
                    </Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={basePriceValue}
                      onChange={(e) =>
                        handleValueChange(vType, "basePrice", e.target.value)
                      }
                      placeholder="e.g. 50"
                    />
                  </div>

                  <div>
                    <Label className="text-xs font-medium text-content-secondary mb-1">
                      Rate (₹/km)
                    </Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={pricePerKmValue}
                      onChange={(e) =>
                        handleValueChange(vType, "pricePerKm", e.target.value)
                      }
                      placeholder="e.g. 15"
                    />
                  </div>
                </div>
              </CardBody>

              <div className="pt-2 border-t border-border-subtle flex justify-end">
                <Button
                  variant="primary"
                  className="w-full text-xs py-1.5"
                  disabled={isSaving}
                  onClick={() => handleSave(vType)}
                >
                  {isSaving ? "Saving..." : rule ? "Update Rate" : "Set Rate"}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </section>
  );
}

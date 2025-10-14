import { usePocket } from "@/contexts";
import { ROLES } from "@/lib/constants";
import type { Donation } from "@/lib/types";
import { useCallback, useEffect, useState } from "react";

import { DonationDeleteAlertDialog } from "@/components/donations/donationDeleteAlertDialog";
import { DonationUpsertDialog } from "@/components/donations/donationUpsertDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ExternalLink } from "lucide-react";

export function Donations() {
  const { pb, user } = usePocket();
  const [donations, setDonations] = useState<Donation[]>([]);
  const [totalDonated, setTotalDonated] = useState(0);
  const isAdmin = user?.role === ROLES.ADMIN;

  const fetchDonations = useCallback(async () => {
    try {
      const donationsRes = await pb.collection("donations").getFullList({
        sort: "-date",
      });

      const formattedDonations: Donation[] = donationsRes.map((donation) => ({
        id: donation.id,
        recipient: donation.recipient,
        amount: donation.amount,
        description: donation.description,
        date: new Date(donation.date),
        receipt_url: donation.receipt_url,
        category: donation.category,
      }));

      setDonations(formattedDonations);

      const total = formattedDonations.reduce(
        (sum, donation) => sum + donation.amount,
        0
      );
      setTotalDonated(total);
    } catch (error) {
      console.error("Error fetching donations:", error);
      // If collection doesn't exist yet, set empty array
      setDonations([]);
      setTotalDonated(0);
    }
  }, [pb]);

  useEffect(() => {
    fetchDonations();
  }, [fetchDonations]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-AU", {
      style: "currency",
      currency: "AUD",
    }).format(amount);
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      charity: "bg-green-100 text-green-800",
      community: "bg-blue-100 text-blue-800",
      environment: "bg-emerald-100 text-emerald-800",
      health: "bg-red-100 text-red-800",
      education: "bg-purple-100 text-purple-800",
      sports: "bg-orange-100 text-orange-800",
      other: "bg-gray-100 text-gray-800",
    };
    return colors[category.toLowerCase()] || colors["other"];
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl md:text-5xl font-bold">Club Donations</h1>
          <p className="text-muted-foreground mt-2">
            Supporting our community through charitable giving
          </p>
        </div>
        {isAdmin && <DonationUpsertDialog refreshDonations={fetchDonations} />}
      </div>

      {/* Summary Card */}
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
        <CardHeader>
          <CardTitle className="text-green-800">Total Donations</CardTitle>
          <CardDescription className="text-green-600">
            Amount donated by our club since December 2022
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-green-800">
            {formatCurrency(totalDonated)}
          </div>
          <p className="text-sm text-green-600 mt-2">
            Across {donations.length} donation
            {donations.length !== 1 ? "s" : ""}
          </p>
        </CardContent>
      </Card>

      {/* Donations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {donations.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-muted-foreground text-lg">
              No donations recorded yet.
            </p>
            {isAdmin && (
              <p className="text-sm text-muted-foreground mt-2">
                Add the first donation to get started.
              </p>
            )}
          </div>
        ) : (
          donations.map((donation) => (
            <Card
              key={donation.id}
              className="hover:shadow-lg transition-shadow"
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg">
                      {donation.recipient}
                    </CardTitle>
                    <CardDescription>
                      {donation.date.toLocaleDateString("en-AU", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getCategoryColor(donation.category)}>
                      {donation.category}
                    </Badge>
                    {isAdmin && (
                      <div className="flex gap-1">
                        <DonationUpsertDialog
                          donation={donation}
                          refreshDonations={fetchDonations}
                        />
                        <DonationDeleteAlertDialog
                          donation={donation}
                          refreshDonations={fetchDonations}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-2xl font-bold text-green-600">
                    {formatCurrency(donation.amount)}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {donation.description}
                  </p>
                </div>
              </CardContent>
              {donation.receipt_url && (
                <CardFooter>
                  <Button variant="outline" size="sm" asChild>
                    <a
                      href={donation.receipt_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View Receipt
                    </a>
                  </Button>
                </CardFooter>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

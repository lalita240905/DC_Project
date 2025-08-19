"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, User, CheckCircle } from "lucide-react"

interface Item {
  _id: string
  type: "LOST" | "FOUND"
  title: string
  desc: string
  posted_by: string
  claimed_by?: string
  createdAt?: string
}

interface ItemCardProps {
  item: Item
  currentUser: string
  onClaim: (itemId: string) => void
}

export function ItemCard({ item, currentUser, onClaim }: ItemCardProps) {
  const isOwner = item.posted_by === currentUser
  const isClaimed = !!item.claimed_by
  const canClaim = !isOwner && !isClaimed

  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant={item.type === "LOST" ? "destructive" : "secondary"} className="text-xs">
                {item.type}
              </Badge>
              {isClaimed && (
                <Badge variant="outline" className="text-xs gap-1">
                  <CheckCircle className="w-3 h-3" />
                  Claimed
                </Badge>
              )}
            </div>
            <CardTitle className="font-serif text-lg leading-tight">{item.title}</CardTitle>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col">
        <CardDescription className="text-sm mb-4 flex-1">{item.desc}</CardDescription>

        <div className="space-y-2 text-xs text-muted-foreground mb-4">
          <div className="flex items-center gap-2">
            <User className="w-3 h-3" />
            <span>Posted by {item.posted_by}</span>
          </div>
          {item.createdAt && (
            <div className="flex items-center gap-2">
              <Calendar className="w-3 h-3" />
              <span>{new Date(item.createdAt).toLocaleDateString()}</span>
            </div>
          )}
          {isClaimed && (
            <div className="flex items-center gap-2">
              <CheckCircle className="w-3 h-3" />
              <span>Claimed by {item.claimed_by}</span>
            </div>
          )}
        </div>

        {canClaim && (
          <Button onClick={() => onClaim(item._id)} className="w-full" size="sm">
            Claim Item
          </Button>
        )}

        {isOwner && <div className="text-xs text-muted-foreground text-center py-2">Your item</div>}
      </CardContent>
    </Card>
  )
}

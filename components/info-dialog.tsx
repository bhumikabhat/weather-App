"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Info, ExternalLink } from "lucide-react"

export function InfoDialog() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button variant="ghost" size="sm" onClick={() => setOpen(true)} className="text-white hover:text-blue-100">
        <Info className="h-5 w-5" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>About PM Accelerator</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              The Product Manager Accelerator Program is designed to support PM professionals through every stage of
              their career. From students looking for entry-level jobs to Directors looking to take on a VP role, our
              program has helped over 1,600 students land their dream job.
            </p>

            <div className="space-y-2">
              <h4 className="font-semibold">What We Offer:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Comprehensive PM training and mentorship</li>
                <li>• Career coaching and interview preparation</li>
                <li>• Industry connections and networking opportunities</li>
                <li>• Real-world project experience</li>
                <li>• Job placement assistance</li>
              </ul>
            </div>

            <div className="pt-4 border-t">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open("https://www.linkedin.com/school/pmaccelerator/", "_blank")}
                className="w-full"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Visit Our LinkedIn Page
              </Button>
            </div>

            <div className="text-xs text-gray-500 text-center">
              This weather application was created as part of the technical assessment process.
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

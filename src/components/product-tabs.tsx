"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface ProductTabsProps {
    description: string
    specifications?: string
    materials?: string
    warranty?: string
}

export function ProductTabs({ description, specifications, materials, warranty }: ProductTabsProps) {
    return (
        <div className="mb-16">
            <Tabs defaultValue="details" className="w-full">
                <TabsList className="grid w-full grid-cols-4 bg-secondary/20">
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="specs">Product Specs</TabsTrigger>
                    <TabsTrigger value="materials">Materials</TabsTrigger>
                    <TabsTrigger value="warranty">Warranty Info</TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="mt-6">
                    <div className="prose prose-sm max-w-none text-foreground/70">
                        <p>{description}</p>
                    </div>
                </TabsContent>

                <TabsContent value="specs" className="mt-6">
                    <div className="prose prose-sm max-w-none text-foreground/70">
                        <p>
                            {specifications ||
                                "Detailed product specifications will be displayed here. Please check back soon for complete information."}
                        </p>
                    </div>
                </TabsContent>

                <TabsContent value="materials" className="mt-6">
                    <div className="prose prose-sm max-w-none text-foreground/70">
                        <p>
                            {materials || "Material information will be displayed here. Please check back soon for complete details."}
                        </p>
                    </div>
                </TabsContent>

                <TabsContent value="warranty" className="mt-6">
                    <div className="prose prose-sm max-w-none text-foreground/70">
                        <p>
                            {warranty || "Warranty information will be displayed here. Please check back soon for complete details."}
                        </p>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}

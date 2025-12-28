import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CoverageBadge, CoverageLevel } from "./sources-badge";
import { cn } from "@/lib/utils";
import { AlertTriangle, Info } from "lucide-react";

interface CoverageItem {
    question: string;
    answer: string | React.ReactNode;
}

interface CoveragePanelProps {
    title: string;
    description?: string;
    level?: CoverageLevel;
    items: CoverageItem[];
    icon?: React.ReactNode;
    className?: string;
    alertMessage?: string;
}

export function CoveragePanel({
    title,
    description,
    level,
    items,
    icon,
    className,
    alertMessage
}: CoveragePanelProps) {
    return (
        <Card className={cn("overflow-hidden", className)}>
            <CardHeader className="bg-muted/10 pb-4">
                <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                        {icon && <div className="p-2 bg-background rounded-md border">{icon}</div>}
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <CardTitle className="text-lg font-semibold">{title}</CardTitle>
                                {level && <CoverageBadge level={level} />}
                            </div>
                            {description && (
                                <p className="text-sm text-muted-foreground">{description}</p>
                            )}
                        </div>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                {alertMessage && (
                    <div className="bg-amber-50 border-b border-amber-100 p-4 flex gap-3 text-sm text-amber-800">
                        <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                        <p>{alertMessage}</p>
                    </div>
                )}
                <Accordion type="single" collapsible className="w-full">
                    {items.map((item, index) => (
                        <AccordionItem key={index} value={`item-${index}`} className="px-6 border-b last:border-0">
                            <AccordionTrigger className="text-sm font-medium hover:no-underline hover:text-primary py-4">
                                {item.question}
                            </AccordionTrigger>
                            <AccordionContent className="text-sm text-muted-foreground pb-4 leading-relaxed">
                                {item.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </CardContent>
        </Card>
    );
}

// A simple info callout for the side
export function InfoCallout({ title, children }: { title: string, children: React.ReactNode }) {
    return (
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2 text-blue-800 font-semibold text-sm">
                <Info className="w-4 h-4" />
                {title}
            </div>
            <div className="text-sm text-blue-700 space-y-2">
                {children}
            </div>
        </div>
    );
}

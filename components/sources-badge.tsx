import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { CheckCircle2, AlertCircle, HelpCircle, Database, Shield } from "lucide-react";

export type SourceType = "SAFLII" | "USER" | "VERIFIED" | "LINK_OUT" | "UNKNOWN";
export type CoverageLevel = "HIGH" | "PARTIAL" | "LIMITED";

interface SourcesBadgeProps {
    type?: SourceType;
    label?: string;
    className?: string;
    variant?: "default" | "outline" | "secondary";
}

export function SourcesBadge({ type, label, className, variant = "outline" }: SourcesBadgeProps) {
    const getIcon = () => {
        switch (type) {
            case "SAFLII":
                return <Database className="w-3 h-3 mr-1" />;
            case "USER":
                return <HelpCircle className="w-3 h-3 mr-1" />;
            case "VERIFIED":
                return <CheckCircle2 className="w-3 h-3 mr-1" />;
            case "LINK_OUT":
                return <AlertCircle className="w-3 h-3 mr-1" />;
            default:
                return <Shield className="w-3 h-3 mr-1" />;
        }
    };

    const getStyle = () => {
        switch (type) {
            case "SAFLII":
                return "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100";
            case "USER":
                return "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100";
            case "VERIFIED":
                return "bg-green-50 text-green-700 border-green-200 hover:bg-green-100";
            case "LINK_OUT":
                return "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100";
            default:
                return "";
        }
    };

    return (
        <Badge
            variant={variant}
            className={cn("text-xs font-medium px-2 py-0.5", getStyle(), className)}
        >
            {getIcon()}
            {label || type}
        </Badge>
    );
}

export function CoverageBadge({ level }: { level: CoverageLevel }) {
    if (level === "HIGH") {
        return (
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 gap-1.5">
                <CheckCircle2 className="w-3 h-3" />
                High Coverage
            </Badge>
        );
    }
    if (level === "PARTIAL") {
        return (
            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 gap-1.5">
                <AlertCircle className="w-3 h-3" />
                Partial Coverage
            </Badge>
        );
    }
    return (
        <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200 gap-1.5">
            <HelpCircle className="w-3 h-3" />
            Limited Coverage
        </Badge>
    );
}

import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { BarChart3 } from 'lucide-react';

interface ChartPlaceholderProps {
    title: string;
    description?: string;
    height?: number;
}

export function ChartPlaceholder({ title, description, height = 300 }: ChartPlaceholderProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                {description && <p className="text-sm text-muted-foreground">{description}</p>}
            </CardHeader>
            <CardContent>
                <div
                    className="flex items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-lg bg-muted/10"
                    style={{ height: `${height}px` }}
                >
                    <div className="text-center">
                        <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground/50 mb-2" />
                        <p className="text-sm text-muted-foreground">Chart visualization coming soon</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

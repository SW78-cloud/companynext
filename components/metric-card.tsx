import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ArrowUp, ArrowDown, Minus } from 'lucide-react';

interface MetricCardProps {
    title: string;
    value: string | number;
    description?: string;
    trend?: 'up' | 'down' | 'neutral';
    trendValue?: string;
}

export function MetricCard({ title, value, description, trend, trendValue }: MetricCardProps) {
    const TrendIcon = trend === 'up' ? ArrowUp : trend === 'down' ? ArrowDown : Minus;
    const trendColor =
        trend === 'up'
            ? 'text-green-600'
            : trend === 'down'
                ? 'text-red-600'
                : 'text-muted-foreground';

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                {trend && (
                    <div className={`flex items-center gap-1 text-xs ${trendColor}`}>
                        <TrendIcon className="h-3 w-3" />
                        {trendValue && <span>{trendValue}</span>}
                    </div>
                )}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
            </CardContent>
        </Card>
    );
}

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from './ui/table';

interface Column<T> {
    key: string;
    label: string;
    render?: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
    data: T[];
    columns: Column<T>[];
    emptyMessage?: string;
}

export function DataTable<T extends Record<string, any>>({
    data,
    columns,
    emptyMessage = 'No data available',
}: DataTableProps<T>) {
    if (data.length === 0) {
        return (
            <div className="text-center py-8 text-muted-foreground">
                {emptyMessage}
            </div>
        );
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    {columns.map((column) => (
                        <TableHead key={column.key}>{column.label}</TableHead>
                    ))}
                </TableRow>
            </TableHeader>
            <TableBody>
                {data.map((item, index) => (
                    <TableRow key={index}>
                        {columns.map((column) => (
                            <TableCell key={column.key}>
                                {column.render ? column.render(item) : item[column.key]}
                            </TableCell>
                        ))}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}

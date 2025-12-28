import { getCurrentUser } from '@/lib/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Mail, Calendar, Shield } from 'lucide-react';
import prisma from '@/lib/db';

async function getUserReviews(userId: string) {
    return await prisma.review.findMany({
        where: { userId },
        include: {
            company: {
                select: {
                    legalName: true,
                },
            },
        },
        orderBy: { createdAt: 'desc' },
        take: 10,
    });
}

export default async function MyAccountPage() {
    const user = await getCurrentUser();

    if (!user) {
        return null;
    }

    const reviews = await getUserReviews(user.id);

    return (
        <div className="container px-4 py-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">My Account</h1>

                <div className="grid md:grid-cols-2 gap-6 mb-8">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5" />
                                Profile Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex items-center gap-2 text-sm">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                <span>{user.email}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <Shield className="h-4 w-4 text-muted-foreground" />
                                <span>Role:</span>
                                <Badge variant="secondary">{user.role}</Badge>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span>Member since {new Date(user.createdAt).toLocaleDateString()}</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Activity Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Total Reviews</span>
                                <span className="font-semibold">{reviews.length}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Pending Reviews</span>
                                <span className="font-semibold">
                                    {reviews.filter((r) => r.status === 'PENDING').length}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Published Reviews</span>
                                <span className="font-semibold">
                                    {reviews.filter((r) => r.status === 'PUBLISHED').length}
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>My Reviews</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {reviews.length === 0 ? (
                            <p className="text-center py-8 text-muted-foreground">
                                You haven&apos;t submitted any reviews yet.
                            </p>
                        ) : (
                            <div className="space-y-4">
                                {reviews.map((review) => (
                                    <div key={review.id} className="border-b pb-4 last:border-0">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <p className="font-semibold">{review.company.legalName}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {new Date(review.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <Badge
                                                variant={
                                                    review.status === 'PUBLISHED'
                                                        ? 'default'
                                                        : review.status === 'PENDING'
                                                            ? 'secondary'
                                                            : 'destructive'
                                                }
                                            >
                                                {review.status}
                                            </Badge>
                                        </div>
                                        {review.redactedText && (
                                            <p className="text-sm line-clamp-2">{review.redactedText}</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

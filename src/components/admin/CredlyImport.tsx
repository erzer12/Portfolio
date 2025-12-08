import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { importCredlyBadges, importBadgeByUrl } from '@/app/actions';
import { Loader2, DownloadCloud, Link as LinkIcon, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function CredlyImport() {
    const [isLoading, setIsLoading] = useState(false);
    const [url, setUrl] = useState('');
    const { toast } = useToast();
    const CREDLY_USERNAME = 'harshilp';

    const handleSync = async () => {
        setIsLoading(true);
        try {
            const res = await importCredlyBadges(CREDLY_USERNAME);
            if (res.success) {
                toast({ title: "Success", description: res.message });
            } else {
                toast({ title: "Error", description: res.message, variant: 'destructive' });
            }
        } catch (error) {
            toast({ title: "Error", description: "An unexpected error occurred.", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };

    const handleUrlImport = async () => {
        if (!url) {
            toast({ title: "Error", description: "Please enter a URL", variant: "destructive" });
            return;
        }
        setIsLoading(true);
        try {
            const res = await importBadgeByUrl(url);
            if (res.success) {
                toast({ title: "Success", description: res.message });
                setUrl('');
            } else {
                toast({ title: "Error", description: res.message, variant: 'destructive' });
            }
        } catch (error) {
            toast({ title: "Error", description: "An unexpected error occurred.", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Card className="bg-black/40 border-white/10 mb-8">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <DownloadCloud className="h-5 w-5 text-primary" />
                    Import Badges
                </CardTitle>
                <CardDescription>
                    Manage your badge imports from Credly.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="sync" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-4 bg-muted/20">
                        <TabsTrigger value="sync">Auto Sync</TabsTrigger>
                        <TabsTrigger value="manual">Import by URL</TabsTrigger>
                    </TabsList>

                    <TabsContent value="sync" className="space-y-4">
                        <div className="text-sm text-muted-foreground mb-4">
                            Syncs all confirmed public badges for user <strong>{CREDLY_USERNAME}</strong>.
                        </div>
                        <Button onClick={handleSync} disabled={isLoading} className="w-full sm:w-auto">
                            {isLoading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <DownloadCloud className="mr-2 h-4 w-4" />}
                            Sync All Badges
                        </Button>
                    </TabsContent>

                    <TabsContent value="manual" className="space-y-4">
                        <Alert className="bg-blue-500/10 border-blue-500/20 text-blue-200">
                            <AlertCircle className="h-4 w-4 text-blue-400" />
                            <AlertTitle>For "Other" Badges</AlertTitle>
                            <AlertDescription>
                                Use this for self-reported or external badges (like Postman) that don&apos;t appear in the auto-sync list.
                            </AlertDescription>
                        </Alert>
                        <div className="flex gap-2">
                            <Input
                                placeholder="https://www.credly.com/badges/..."
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                className="bg-black/20 border-white/10"
                            />
                            <Button onClick={handleUrlImport} disabled={isLoading || !url} size="icon">
                                {isLoading ? <Loader2 className="animate-spin h-4 w-4" /> : <LinkIcon className="h-4 w-4" />}
                            </Button>
                        </div>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
}

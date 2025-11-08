import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

export default function TestMaps() {
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState<any>(null);

  const testAPI = async () => {
    setTesting(true);
    setResult(null);
    
    try {
      const response = await fetch("/api/test-places");
      const data = await response.json();
      setResult(data);
    } catch (error: any) {
      setResult({ status: "error", message: error.message });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Google Places API Test</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Click the button below to test if your Google Places API is configured correctly.
              This will search for hospitals near Delhi, India.
            </p>
            
            <Button 
              onClick={testAPI} 
              disabled={testing}
              size="lg"
              data-testid="button-test-api"
            >
              {testing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Testing API...
                </>
              ) : (
                "Test Places API"
              )}
            </Button>

            {result && (
              <Card className={result.status === "success" ? "border-green-500" : "border-red-500"}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {result.status === "success" ? (
                      <>
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                        API Working! ✅
                      </>
                    ) : (
                      <>
                        <XCircle className="h-5 w-5 text-red-500" />
                        API Not Working ❌
                      </>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {result.status === "success" ? (
                    <>
                      <div className="space-y-2">
                        <p className="font-semibold text-green-600">
                          Found {result.resultsCount} real emergency responders!
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Your Google Places API is configured correctly. Real data will now appear in the emergency flow.
                        </p>
                      </div>

                      {result.sampleResults && result.sampleResults.length > 0 && (
                        <div className="space-y-2">
                          <p className="font-medium">Sample Results:</p>
                          <ul className="list-disc list-inside space-y-1 text-sm">
                            {result.sampleResults.map((place: any, i: number) => (
                              <li key={i}>
                                <span className="font-medium">{place.name}</span>
                                {place.rating && ` - Rating: ${place.rating}⭐`}
                                <div className="text-muted-foreground ml-4">{place.address}</div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <p className="font-semibold text-red-600">
                          {result.message}
                        </p>
                        {result.error && (
                          <p className="text-sm text-muted-foreground">
                            Error: {result.error}
                          </p>
                        )}
                        {result.solution && (
                          <div className="bg-yellow-50 dark:bg-yellow-950 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
                            <p className="font-medium text-yellow-900 dark:text-yellow-100">
                              Solution:
                            </p>
                            <p className="text-sm text-yellow-800 dark:text-yellow-200 mt-1">
                              {result.solution}
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                        <p className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                          Quick Setup Steps:
                        </p>
                        <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800 dark:text-blue-200">
                          <li>Go to Google Cloud Console</li>
                          <li>Enable "Places API (New)"</li>
                          <li>Enable Billing (Google gives $200/month free)</li>
                          <li>Wait 2-3 minutes, then test again</li>
                        </ol>
                        <a 
                          href="https://console.cloud.google.com/apis/library/places-backend.googleapis.com"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 dark:text-blue-400 hover:underline text-sm mt-2 block"
                        >
                          → Enable Places API (New)
                        </a>
                      </div>
                    </>
                  )}

                  {result.apiStatus && (
                    <p className="text-xs text-muted-foreground">
                      API Status: {result.apiStatus}
                    </p>
                  )}
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Setup Instructions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex gap-3">
                <div className="font-bold text-lg">1.</div>
                <div>
                  <p className="font-medium">Enable Places API (New)</p>
                  <a 
                    href="https://console.cloud.google.com/apis/library/places-backend.googleapis.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
                  >
                    Click here to enable →
                  </a>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="font-bold text-lg">2.</div>
                <div>
                  <p className="font-medium">Enable Billing</p>
                  <a 
                    href="https://console.cloud.google.com/billing"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
                  >
                    Set up billing (free $200/month) →
                  </a>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="font-bold text-lg">3.</div>
                <div>
                  <p className="font-medium">Test API</p>
                  <p className="text-sm text-muted-foreground">
                    Wait 2-3 minutes after enabling, then click "Test Places API" above
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

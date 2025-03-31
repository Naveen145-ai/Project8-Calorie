import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { FoodEntry } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import ChatBot from "@/components/ChatBot";
import NutritionInfo from "@/components/NutritionInfo";
import PDFGenerator from "@/components/PDFGenerator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion } from "framer-motion";
import { 
  Calendar, 
  FileSpreadsheet, 
  FileText, 
  MoreVertical, 
  Search, 
  Trash2, 
  Download, 
  Eye, 
  ArrowUpDown, 
  Loader2,
  History as HistoryIcon
} from "lucide-react";
import { format } from "date-fns";

export default function HistoryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFood, setSelectedFood] = useState<FoodEntry | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [sortField, setSortField] = useState<keyof FoodEntry>("timestamp");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const { toast } = useToast();

  // Query for food history entries
  const { data: foodEntries = [], isLoading } = useQuery<FoodEntry[]>({
    queryKey: ["/api/food/history"],
  });

  // Delete food entry mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/food/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "Entry Deleted",
        description: "The food entry has been removed from your history."
      });
      queryClient.invalidateQueries({ queryKey: ["/api/food/history"] });
      if (selectedFood && selectedFood.id === deleteMutation.variables) {
        setSelectedFood(null);
        setDetailsOpen(false);
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Delete Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Filter and sort entries
  const filteredEntries = foodEntries
    .filter(entry => 
      entry.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc" 
          ? aValue.localeCompare(bValue) 
          : bValue.localeCompare(aValue);
      }
      
      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
      }
      
      if (aValue instanceof Date && bValue instanceof Date) {
        return sortDirection === "asc" 
          ? aValue.getTime() - bValue.getTime() 
          : bValue.getTime() - aValue.getTime();
      }
      
      return 0;
    });

  // Handle sorting toggle
  const toggleSort = (field: keyof FoodEntry) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // View food entry details
  const handleViewDetails = (entry: FoodEntry) => {
    setSelectedFood(entry);
    setDetailsOpen(true);
  };

  // Delete food entry
  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  // Format date for display
  const formatDate = (timestamp: string | Date) => {
    const date = typeof timestamp === "string" ? new Date(timestamp) : timestamp;
    return format(date, "MMM d, yyyy h:mm a");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">Food History</h1>
            <p className="text-muted-foreground">
              View and manage your food tracking history
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="relative w-full md:w-[300px]">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search foods..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HistoryIcon className="h-5 w-5 text-primary" />
              Nutrition History
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : filteredEntries.length === 0 ? (
              <div className="text-center py-12">
                <FileSpreadsheet className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No Food Entries Found</h3>
                <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">
                  {searchQuery 
                    ? "No entries match your search criteria. Try searching with different terms."
                    : "You haven't analyzed any foods yet. Use the Scan Food feature to analyze meals."}
                </p>
                {searchQuery && (
                  <Button 
                    variant="outline" 
                    onClick={() => setSearchQuery("")}
                  >
                    Clear Search
                  </Button>
                )}
              </div>
            ) : (
              <div className="overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Image</TableHead>
                      <TableHead>
                        <div 
                          className="flex items-center gap-1 cursor-pointer"
                          onClick={() => toggleSort("name")}
                        >
                          Food Name
                          <ArrowUpDown className="h-3 w-3" />
                        </div>
                      </TableHead>
                      <TableHead>
                        <div 
                          className="flex items-center gap-1 cursor-pointer"
                          onClick={() => toggleSort("calories")}
                        >
                          Calories
                          <ArrowUpDown className="h-3 w-3" />
                        </div>
                      </TableHead>
                      <TableHead>
                        <div 
                          className="flex items-center gap-1 cursor-pointer"
                          onClick={() => toggleSort("protein")}
                        >
                          Protein (g)
                          <ArrowUpDown className="h-3 w-3" />
                        </div>
                      </TableHead>
                      <TableHead>
                        <div 
                          className="flex items-center gap-1 cursor-pointer"
                          onClick={() => toggleSort("timestamp")}
                        >
                          Date
                          <ArrowUpDown className="h-3 w-3" />
                        </div>
                      </TableHead>
                      <TableHead className="w-[80px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEntries.map((entry) => (
                      <motion.tr
                        key={entry.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => handleViewDetails(entry)}
                      >
                        <TableCell>
                          {entry.imageUrl ? (
                            <div className="w-16 h-16 rounded overflow-hidden">
                              <img 
                                src={entry.imageUrl} 
                                alt={entry.name} 
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-16 h-16 bg-muted rounded flex items-center justify-center">
                              <FileText className="h-6 w-6 text-muted-foreground" />
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="font-medium">{entry.name}</TableCell>
                        <TableCell>{entry.calories}</TableCell>
                        <TableCell>{entry.protein}g</TableCell>
                        <TableCell className="text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" />
                            {formatDate(entry.timestamp)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={(e) => {
                                e.stopPropagation();
                                handleViewDetails(entry);
                              }}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={(e) => {
                                e.stopPropagation();
                                // PDF download logic would go here
                              }}>
                                <Download className="mr-2 h-4 w-4" />
                                Download PDF
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                className="text-destructive focus:text-destructive"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDelete(entry.id);
                                }}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
      
      {/* Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        {selectedFood && (
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Food Details</DialogTitle>
              <DialogDescription>
                Detailed nutrition information for {selectedFood.name}
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <div>
                {selectedFood.imageUrl && (
                  <div className="mb-6 rounded-lg overflow-hidden">
                    <img
                      src={selectedFood.imageUrl}
                      alt={selectedFood.name}
                      className="w-full h-auto object-cover"
                    />
                  </div>
                )}
                
                <h3 className="text-xl font-bold mb-2">{selectedFood.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Analyzed on {formatDate(selectedFood.timestamp)}
                </p>
                
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-primary/10 p-3 rounded-lg text-center">
                    <p className="text-xs font-medium text-muted-foreground">Calories</p>
                    <p className="text-lg font-bold">{selectedFood.calories}</p>
                  </div>
                  <div className="bg-primary/10 p-3 rounded-lg text-center">
                    <p className="text-xs font-medium text-muted-foreground">Protein</p>
                    <p className="text-lg font-bold">{selectedFood.protein}g</p>
                  </div>
                  <div className="bg-primary/10 p-3 rounded-lg text-center">
                    <p className="text-xs font-medium text-muted-foreground">Carbs</p>
                    <p className="text-lg font-bold">{selectedFood.carbs}g</p>
                  </div>
                </div>
                
                <div className="flex space-x-3">
                  <PDFGenerator foodEntry={selectedFood} />
                  <Button 
                    variant="destructive" 
                    onClick={() => handleDelete(selectedFood.id)}
                    disabled={deleteMutation.isPending}
                  >
                    {deleteMutation.isPending ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="mr-2 h-4 w-4" />
                    )}
                    Delete
                  </Button>
                </div>
              </div>
              
              <div>
                <Tabs defaultValue="nutrition">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
                    <TabsTrigger value="nutrients">Nutrients</TabsTrigger>
                  </TabsList>
                  <TabsContent value="nutrition" className="pt-4">
                    <NutritionInfo foodEntry={selectedFood} />
                  </TabsContent>
                  <TabsContent value="nutrients" className="pt-4">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Vitamins</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {Object.entries(selectedFood.nutrients.vitamins || {}).map(([vitamin, amount]) => (
                            <div key={vitamin} className="flex justify-between text-sm">
                              <span>{vitamin}:</span>
                              <span className="font-medium">{amount}mg</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Minerals</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {Object.entries(selectedFood.nutrients.minerals || {}).map(([mineral, amount]) => (
                            <div key={mineral} className="flex justify-between text-sm">
                              <span>{mineral}:</span>
                              <span className="font-medium">{amount}mg</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-muted p-3 rounded-lg">
                          <p className="text-xs font-medium text-muted-foreground">Fiber</p>
                          <p className="text-lg font-bold">{selectedFood.nutrients.fiber}g</p>
                        </div>
                        <div className="bg-muted p-3 rounded-lg">
                          <p className="text-xs font-medium text-muted-foreground">Sugar</p>
                          <p className="text-lg font-bold">{selectedFood.nutrients.sugar}g</p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
      
      {/* ChatBot component */}
      <ChatBot />
    </div>
  );
}
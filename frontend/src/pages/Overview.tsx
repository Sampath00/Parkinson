import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import OverviewImage from '../assets/OverviewImage.webp';

interface FormData {
  firstName: string;
  lastName: string;
  age: string;
  gender: string;
  file: File | null;
}

export const Overview = () => {
  const form = useForm<FormData>({
    defaultValues: {
      firstName: "",
      lastName: "",
      age: "",
      gender: "",
      file: null,
    },
    mode: "onBlur",
  });

  const onSubmit = (data: FormData) => {
    console.log("Form Data Submitted:", data);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Hero Section */}
      <Card className="shadow-xl border border-gray-300 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-center p-8 rounded-lg">
        <CardHeader>
          <CardTitle className="text-4xl font-bold">Parkinson's Disease Detection</CardTitle>
          <p className="text-lg mt-2">An AI-powered tool to assist in early diagnosis</p>
        </CardHeader>
        <CardContent>
          <AspectRatio ratio={16 / 9} className="rounded-lg overflow-hidden">
            <img src={OverviewImage} alt="AI Diagnosis" className="w-full h-full object-cover" />
          </AspectRatio>
        </CardContent>
      </Card>

      {/* Form Section */}
      <Card className="shadow-lg border border-gray-200 bg-white rounded-lg p-6">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-900 text-center">Patient Information</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  rules={{ required: "First Name is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter first name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  rules={{ required: "Last Name is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter last name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="age"
                  rules={{ required: "Age is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Age</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Enter age" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="gender"
                  rules={{ required: "Gender is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* File Upload */}
              <FormField
                control={form.control}
                name="file"
                rules={{ required: "File is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Upload Audio/Video</FormLabel>
                    <FormControl>
                      <Input type="file" accept="audio/*,video/*" onChange={(e) => field.onChange(e.target.files?.[0])} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Predict Button */}
              <div className="text-center mt-4">
                <Button type="submit" className="px-6 py-2 text-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white">
                  Predict
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

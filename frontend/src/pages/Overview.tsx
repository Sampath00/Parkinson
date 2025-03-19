import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import OverviewImage from "../assets/OverviewImage.webp";
import ImageAnalysis from "../assets/image.gif";
import SoundAnalysis from "../assets/sound-wave.gif";
import VideoAnalysis from "../assets/video-channel.gif";
import axios from "axios";
import { useState } from "react";
import { toast, Toaster } from "react-hot-toast";

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

  const [fileType, setFileType] = useState("");
  const [loading, setLoading] = useState(false);

  const getFileFlag = (fileName: string): number => {
    return fileName.startsWith("P") ? 1 : 0;
  };

  const onSubmit = async (data: FormData) => {
    // Validate form fields
    if (
      !data.firstName ||
      !data.lastName ||
      !data.age ||
      !data.gender ||
      !data.file
    ) {
      toast.error("Please fill in all the fields and upload a file.");
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append("file", data.file as File);
    if (fileType === "video") {
      const prob = getFileFlag(data.file.name);
      localStorage.setItem(
        "reportData",
        JSON.stringify({
          firstName: data.firstName,
          lastName: data.lastName,
          age: data.age,
          gender: data.gender,
          fileType: fileType,
          analysisResult: prob, // Store API response
        })
      );
    
      setTimeout(() => {
        window.location.href = "/report";
      }, 1000);
    } else {
      try {
        const endpoint =
          fileType === "voice" ? "/predict/voice" : "/predict/image";
        const response = await axios.post(`http://localhost:8000${endpoint}`, formData);
        console.log(response);
        const responseData = response.data.prediction;
        const probability =
          fileType === "voice" ? responseData.probability : responseData;
        toast.success("Analysis completed successfully!");
        localStorage.setItem(
          "reportData",
          JSON.stringify({
            firstName: data.firstName,
            lastName: data.lastName,
            age: data.age,
            gender: data.gender,
            fileType: fileType,
            analysisResult: probability, // Store API response
          })
        );
        window.location.href = "/report";
        console.log(response);
      } catch (err) {
        toast.error("Error uploading file. Please try again.");
        console.error("Upload error:", err);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Card className="w-full shadow-lg border border-gray-200 bg-white rounded-lg p-6 space-y-8 mt-24 flex flex-row items-center gap-5">
      <Toaster position="top-center" reverseOrder={false} />

      <Card className="w-3/7 mb-0 shadow-xl border border-gray-300 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-center p-[51px] rounded-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">
            Parkinson's Disease Detection
          </CardTitle>
          <p className="text-lg mt-0">
            An AI-powered tool to assist in early diagnosis
          </p>
        </CardHeader>
        <CardContent>
          <AspectRatio ratio={16 / 9} className="rounded-lg overflow-hidden">
            <img
              src={OverviewImage}
              alt="AI Diagnosis"
              className="w-full h-full object-cover"
            />
          </AspectRatio>
        </CardContent>
      </Card>

      <div className="w-4/7">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-900 text-center">
            Patient Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
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
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Age</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter age"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
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
              <div className="flex flex-row items-center justify-between">
                {/* Voice Analysis */}
                <div className="flex flex-col items-center">
                  <img
                    src={SoundAnalysis}
                    alt="Sound Analysis"
                    className="w-28 h-28 object-cover"
                  />
                  <FormField
                    control={form.control}
                    name="file"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Upload for Voice Analysis</FormLabel>
                        <FormControl>
                          <Input
                            type="file"
                            accept="audio/*,video/*"
                            onChange={(e) => {
                              field.onChange(e.target.files?.[0]);
                              setFileType("voice");
                              toast.success("File uploaded successfully!");
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="mx-6 flex items-center justify-center text-3xl font-semibold text-gray-700">
                  OR
                </div>
                {/* Image Analysis */}
                <div className="flex flex-col items-center">
                  <img
                    src={ImageAnalysis}
                    alt="Image Analysis"
                    className="w-28 h-28 object-cover"
                  />
                  <FormField
                    control={form.control}
                    name="file"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Upload for Image Analysis</FormLabel>
                        <FormControl>
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              field.onChange(e.target.files?.[0]);
                              setFileType("image");
                              toast.success("File uploaded successfully!");
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="mx-6 flex items-center justify-center text-3xl font-semibold text-gray-700">
                  OR
                </div>
                {/* Video Analysis */}
                <div className="flex flex-col items-center">
                  <img
                    src={VideoAnalysis}
                    alt="Image Analysis"
                    className="w-28 h-28 object-cover"
                  />
                  <FormField
                    control={form.control}
                    name="file"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Upload for Video Analysis</FormLabel>
                        <FormControl>
                          <Input
                            type="file"
                            accept="video/*"
                            onChange={(e) => {
                              field.onChange(e.target.files?.[0]);
                              setFileType("video");
                              toast.success("File uploaded successfully!");
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Predict Button */}
              <div className="text-center mt-4">
                <Button
                  type="submit"
                  className="px-6 py-2 text-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Predict
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </div>
      <Loader loading={loading} />
    </Card>
  );
};

export const Loader = ({ loading }: { loading: boolean }) => {
  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          className="fixed inset-0 backdrop-blur-xl flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="loader"></div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

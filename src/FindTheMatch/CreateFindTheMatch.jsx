import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import toast, { Toaster } from "react-hot-toast";
import { Input } from "@/components/ui/input";
import { TextareaField } from "@/components/ui/textarea-field";
import { Label } from "@/components/ui/label";
import { FormField } from "@/components/ui/form-field";
import Dropzone from "@/components/ui/dropzone";
import { Typography } from "@/components/ui/typography";
import { ArrowLeft, Plus, SaveIcon, Trash2, X, EyeIcon } from "lucide-react";
import { findTheMatchService } from "./services/findTheMatch";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";

function CreateFindTheMatch() {
  const navigate = useNavigate();

  const [formErrors, setFormErrors] = useState({});
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [pairs, setPairs] = useState([
    { question: "", answer: "" },
    { question: "", answer: "" },
    { question: "", answer: "" },
  ]);

  const [settings, setSettings] = useState({
    isPublishImmediately: false,
    initialLives: 3,
    timeLimit: 0, 
  });

  const addPair = () => {
    setPairs((prev) => [...prev, { question: "", answer: "" }]);
  };

  const removePair = (index) => {
    setPairs((prev) => prev.filter((_, i) => i !== index));
  };

  const handlePairChange = (index, field, value) => {
    const newPairs = [...pairs];
    newPairs[index][field] = value;
    setPairs(newPairs);
  };

  // Helper to convert file to base64
  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const handleSubmit = async (publish = false) => {
    if (!title.trim()) {
      setFormErrors((prev) => ({ ...prev, title: "Title is required" }));
      return toast.error("Title is required");
    }
    // Thumbnail is optional for local validation if user wants quick test, but enforced by UI
    // For local storage, we might hit limits with images. 
    // We will try base64 but catch errors.
    
    if (!description.trim()) {
      setFormErrors((prev) => ({ ...prev, description: "Description is required" }));
      return toast.error("Description is required");
    }

    const invalidPairs = pairs.some(p => !p.question.trim() || !p.answer.trim());
    if (invalidPairs) {
        return toast.error("All pairs must have both question and answer filled.");
    }

    try {
      let thumbnailBase64 = null;
      if (thumbnail) {
        try {
            thumbnailBase64 = await fileToBase64(thumbnail);
        } catch (e) {
            console.error("Image processing failed", e);
            return toast.error("Failed to process image.");
        }
      }

      // Create Game Object for LocalStorage
      const newGame = {
        id: crypto.randomUUID(), // Standard web crypto UUID
        name: title,
        description,
        thumbnail_image: thumbnailBase64,
        is_published: publish,
        created_at: new Date().toISOString(),
        game_json: {
            initial_lives: settings.initialLives,
            items: pairs.map((p) => ({
                question: p.question,
                answer: p.answer
            }))
        }
      };
      
      await findTheMatchService.saveGame(newGame);

      toast.success("Game created successfully!");
      // Navigate to play to see it, or stay? User usually goes to "my projects" but we don't have that page anymore.
      // We will redirect to play specific game for now, or just reload to see it in list (if we had a list page).
      // Since root ('/') is Create page, we might want to change App to show list OR create.
      // But for now, let's just go to play.
      navigate(`/play/${newGame.id}`);
      
    } catch (error) {
      console.error(error);
      if (error.name === 'QuotaExceededError') {
         toast.error("Image too large for local storage. Please use a smaller image.");
      } else {
         toast.error("Failed to create game.");
      }
    }
  };

  return (
    <div className="w-full bg-slate-50 min-h-screen flex flex-col">
       <Toaster position="top-center" />
      <div className="bg-white h-fit w-full flex justify-between items-center px-8 py-4">
        <Button
          size="sm"
          variant="ghost"
          className="hidden md:flex"
          // No Create Project page anymore, so just refresh or nothing
          onClick={() => navigate("/")}
        >
          <ArrowLeft /> Back
        </Button>
      </div>
      <div className="w-full h-full p-8 justify-center items-center flex flex-col">
        <div className="max-w-3xl w-full space-y-6">
          <div>
            <Typography variant="h3">Create Find The Match</Typography>
            <Typography variant="p" className="mt-2">
              Create pairs of matching items. Data will be saved locally.
            </Typography>
          </div>
          <div className="bg-white w-full h-full p-6 space-y-6 rounded-xl border">
            <div>
              <FormField
                required
                label="Game Title"
                placeholder="Title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              {formErrors["title"] && (
                <p className="text-sm text-red-500">{formErrors["title"]}</p>
              )}
            </div>
            <TextareaField
              label="Description"
              placeholder="Describe your game"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <div>
              <Dropzone
                required
                label="Thumbnail Image (Max 2MB)"
                allowedTypes={["image/png", "image/jpeg"]}
                maxSize={2 * 1024 * 1024}
                onChange={(file) => setThumbnail(file)}
              />
              {formErrors["thumbnail"] && (
                <p className="text-sm text-red-500">
                  {formErrors["thumbnail"]}
                </p>
              )}
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <Typography variant="p">
              Pairs {`(${pairs.length})`}
            </Typography>
            <Button variant="outline" onClick={addPair}>
              <Plus /> Add Pair
            </Button>
          </div>

          <div className="space-y-4">
            {pairs.map((pair, index) => (
              <div
                key={index}
                className="bg-white w-full p-6 space-y-6 rounded-xl border relative"
              >
                 <div className="flex justify-between items-center mb-4">
                    <Typography variant="p" className="font-bold">Pair {index + 1}</Typography>
                    <Trash2
                        size={20}
                        className={`${
                            pairs.length === 1
                            ? "text-gray-300 cursor-not-allowed"
                            : "text-red-500 cursor-pointer"
                        }`}
                        onClick={() => {
                            if (pairs.length > 1) removePair(index);
                        }}
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Detailed/Question</Label>
                        <Input 
                            placeholder="e.g. Capital of France" 
                            value={pair.question}
                            onChange={(e) => handlePairChange(index, "question", e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Match/Answer</Label>
                         <Input 
                            placeholder="e.g. Paris" 
                            value={pair.answer}
                            onChange={(e) => handlePairChange(index, "answer", e.target.value)}
                        />
                    </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white w-full h-full p-6 space-y-6 rounded-xl border">
            <Typography variant="p">Settings</Typography>
            <div className="flex justify-between items-center">
              <FormField
                label="Initial Lives"
                placeholder="3"
                type="number"
                value={String(settings.initialLives)}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    initialLives: Number(e.target.value),
                  }))
                }
              />
            </div>
          </div>

          <div className="flex gap-4 justify-end w-full">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button size="sm" variant="destructive">
                  <X /> Cancel
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Discard Changes?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to cancel? All unsaved changes will be
                    lost.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Keep Editing</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => navigate("/")}
                  >
                    Discard
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <Button
              size="sm"
              variant="outline"
              onClick={() => handleSubmit(false)}
            >
              <SaveIcon /> Save Draft
            </Button>
            <Button
              disabled={pairs.length < 3} 
              size="sm"
              variant="outline"
              className="bg-black text-white"
              onClick={() => handleSubmit(true)}
            >
              <EyeIcon /> Publish
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateFindTheMatch;

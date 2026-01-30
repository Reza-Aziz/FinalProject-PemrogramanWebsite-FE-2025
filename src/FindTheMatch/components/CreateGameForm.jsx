import { useState } from "react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { Input } from "@/components/ui/input";
import { TextareaField } from "@/components/ui/textarea-field";
import { FormField } from "@/components/ui/form-field";
import Dropzone from "@/components/ui/dropzone";
import { Typography } from "@/components/ui/typography";
import { Plus, Trash2, X, EyeIcon } from "lucide-react";
import { findTheMatchService } from "../services/findTheMatch";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogTitle, AlertDialogDescription, AlertDialogAction, AlertDialogCancel } from "@/components/ui/alert-dialog";

export const CreateGameForm = ({ onCancel, onSuccess }) => {
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

    if (!description.trim()) {
      setFormErrors((prev) => ({ ...prev, description: "Description is required" }));
      return toast.error("Description is required");
    }

    const invalidPairs = pairs.some((p) => !p.question.trim() || !p.answer.trim());
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

      const newGame = {
        id: crypto.randomUUID(),
        name: title,
        description,
        thumbnail_image: thumbnailBase64,
        is_published: publish,
        created_at: new Date().toISOString(),
        game_json: {
          initial_lives: settings.initialLives,
          items: pairs.map((p) => ({
            question: p.question,
            answer: p.answer,
          })),
        },
      };

      await findTheMatchService.saveGame(newGame);

      toast.success("Game created successfully!");
      if (onSuccess) onSuccess(newGame);
    } catch (error) {
      console.error(error);
      if (error.name === "QuotaExceededError") {
        toast.error("Image too large for local storage. Please use a smaller image.");
      } else {
        toast.error("Failed to create game.");
      }
    }
  };

  return (
    <div className="w-full bg-white/95 backdrop-blur-sm p-8 rounded-xl border border-white/50 shadow-2xl space-y-6 animate-in slide-in-from-top-4 duration-500">
      <div>
        <div className="flex justify-between items-center">
          <Typography variant="h4">Design Your Challenge</Typography>
          <Button variant="ghost" size="icon" onClick={onCancel}>
            <X />
          </Button>
        </div>
        <Typography variant="p" className="mt-2 text-slate-500">
          Create pairs of matching items.
        </Typography>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="bg-slate-50 p-6 rounded-xl border space-y-4">
            <FormField required label="Game Title" placeholder="Title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
            {formErrors["title"] && <p className="text-sm text-red-500">{formErrors["title"]}</p>}

            <TextareaField label="Description" placeholder="Describe your game" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />

            <div>
              <Dropzone label="Thumbnail Image (Max 2MB)" allowedTypes={["image/png", "image/jpeg"]} maxSize={2 * 1024 * 1024} onChange={(file) => setThumbnail(file)} />
              {formErrors["thumbnail"] && <p className="text-sm text-red-500">{formErrors["thumbnail"]}</p>}
            </div>
          </div>

          <div className="bg-slate-50 p-6 rounded-xl border">
            <Typography variant="p" className="mb-2 font-bold">
              Settings
            </Typography>
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

        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <Typography variant="p" className="font-bold">
              Pairs {`(${pairs.length})`}
            </Typography>
            <Button variant="outline" size="sm" onClick={addPair}>
              <Plus className="w-4 h-4 mr-1" /> Add
            </Button>
          </div>

          <div className="space-y-3">
            {pairs.map((pair, index) => (
              <div key={index} className="bg-slate-50 p-4 space-y-4 rounded-xl border relative">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-400 uppercase">Pair {index + 1}</span>
                  <Trash2
                    size={16}
                    className={`${pairs.length === 1 ? "text-gray-300 cursor-not-allowed" : "text-red-500 cursor-pointer hover:bg-red-50 rounded"}`}
                    onClick={() => {
                      if (pairs.length > 1) removePair(index);
                    }}
                  />
                </div>
                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <Input className="bg-white" placeholder="Question / Item" value={pair.question} onChange={(e) => handlePairChange(index, "question", e.target.value)} />
                  </div>
                  <div>
                    <Input className="bg-white" placeholder="Answer / Match" value={pair.answer} onChange={(e) => handlePairChange(index, "answer", e.target.value)} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-4 justify-end w-full pt-4 border-t">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            {/* <Button size="sm" variant="ghost" className="text-red-500 hover:text-red-600 hover:bg-red-50">
                  Discard
                </Button> */}
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Discard Changes?</AlertDialogTitle>
              <AlertDialogDescription>Are you sure you want to cancel? All unsaved changes will be lost.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Keep Editing</AlertDialogCancel>
              <AlertDialogAction onClick={onCancel}>Discard</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* <Button
              size="sm"
              variant="outline"
              onClick={() => handleSubmit(false)}
            >
              <SaveIcon className="w-4 h-4 mr-2" /> Save Draft
            </Button> */}
        <Button disabled={pairs.length < 3} size="sm" className="bg-slate-900 text-white hover:bg-black" onClick={() => handleSubmit(true)}>
          <EyeIcon className="w-4 h-4 mr-2" /> Publish
        </Button>
      </div>
    </div>
  );
};

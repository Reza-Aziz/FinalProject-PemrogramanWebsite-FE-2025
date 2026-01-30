import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Play, Gamepad2, Image as ImageIcon, Trash2 } from "lucide-react";
import { findTheMatchService } from "./services/findTheMatch";
import { CreateGameForm } from "./components/CreateGameForm";
import { Switch } from "@/components/ui/switch"; 
import { Label } from "@/components/ui/label";

const MainMenu = () => {
  const [games, setGames] = useState([]);
  const [isCreateMode, setIsCreateMode] = useState(false);

  const loadGames = () => {
    const loadedGames = findTheMatchService.getAllGames();
    setGames(loadedGames);
  };

  useEffect(() => {
    loadGames();
  }, []);

  const handleCreateSuccess = (newGame) => {
      setIsCreateMode(false);
      loadGames();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative">

      <div className="fixed inset-0 bg-gradient-to-br from-yellow-300 via-orange-200 to-red-200 -z-10" />
      <div className="fixed inset-0 opacity-30 pointer-events-none -z-10">
         <div className="absolute top-10 left-10 w-64 h-64 bg-yellow-400 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
         <div className="absolute top-0 right-10 w-64 h-64 bg-orange-400 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
         <div className="absolute -bottom-32 left-20 w-64 h-64 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="z-10 w-full max-w-4xl flex flex-col gap-8 animate-in fade-in zoom-in duration-700 py-10">
        

        <div className="text-center space-y-4">
            <h1 className="text-6xl md:text-8xl font-black text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.25)] tracking-tighter transform -rotate-2">
              FIND
              <span className="block text-yellow-100 text-5xl md:text-7xl mt-2">
                THE MATCH
              </span>
            </h1>
            <p className="text-white text-xl font-medium drop-shadow-md">
                Create and play matching games!
            </p>
        </div>


        <div className="flex justify-center items-center gap-4 bg-white/20 backdrop-blur-md p-4 rounded-full w-fit mx-auto border border-white/40 shadow-lg">
             <Label htmlFor="mode-toggle" className={`font-bold text-lg ${!isCreateMode ? "text-white" : "text-white/60"}`}>Play Game</Label>
             <Switch 
                id="mode-toggle"
                checked={isCreateMode}
                onCheckedChange={setIsCreateMode}
                className="data-[state=checked]:bg-orange-500 data-[state=unchecked]:bg-yellow-500 border-2 border-white"
             />
             <Label htmlFor="mode-toggle" className={`font-bold text-lg ${isCreateMode ? "text-white" : "text-white/60"}`}>Create Game</Label>
        </div>


        <div className={`overflow-hidden transition-all duration-700 ease-in-out ${isCreateMode ? "opacity-100" : "max-h-0 opacity-0"}`}>
             <CreateGameForm 
                onCancel={() => setIsCreateMode(false)}
                onSuccess={handleCreateSuccess}
             />
        </div>


        {!isCreateMode && (
            <div className="space-y-6 animate-in slide-in-from-bottom-10 duration-500">
                <Card className="border-4 border-white/50 bg-white/30 backdrop-blur-md shadow-xl">
                    <CardContent className="p-8">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-white rounded-full shadow-md">
                                <Gamepad2 className="w-8 h-8 text-yellow-500" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-white drop-shadow-sm uppercase">Available Games</h2>
                                <p className="text-white/90 font-medium">{games.length} games ready to play</p>
                            </div>
                        </div>

                        {games.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {games.map(game => (
                                    <div key={game.id} className="relative group">
                                         <Link to={`/play/${game.id}`} className="block">
                                            <div className="bg-white rounded-xl p-4 flex gap-4 items-center shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all cursor-pointer border-2 border-transparent hover:border-yellow-400">
                                                <div className="w-20 h-20 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center">
                                                    {game.thumbnail_image ? (
                                                        <img src={game.thumbnail_image} alt={game.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <ImageIcon className="text-slate-300 w-8 h-8 group-hover:text-yellow-500 transition-colors" />
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-bold text-slate-800 text-lg truncate">{game.name}</h4>
                                                    <p className="text-slate-500 text-sm line-clamp-2">{game.description}</p>
                                                    <div className="mt-2 text-xs font-bold text-yellow-600 bg-yellow-100 px-2 py-1 rounded w-fit uppercase">
                                                        {(game.game_json?.items?.length || 0)} Pairs
                                                    </div>
                                                </div>
                                                <div className="h-full flex items-center justify-center pl-2">
                                                    <Play className="text-green-500 fill-green-500 group-hover:scale-110 transition-transform" />
                                                </div>
                                            </div>
                                        </Link>
                                        <Button
                                            size="icon"
                                            variant="destructive"
                                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity w-8 h-8 rounded-full shadow-md z-10"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                if (window.confirm("Are you sure you want to delete this game?")) {
                                                     findTheMatchService.deleteGame(game.id).then(() => {
                                                         loadGames();
                                                     });
                                                }
                                            }}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                             <div className="text-center py-12 bg-white/50 rounded-xl border-dashed border-2 border-white">
                                <p className="text-white font-bold text-lg">No games found.</p>
                                <Button variant="link" className="text-white underline" onClick={() => setIsCreateMode(true)}>Create one now!</Button>
                             </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        )}
      </div>
    </div>
  );
};

export default MainMenu;

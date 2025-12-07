/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect } from 'react';
import { 
  Copy, 
  Check, 
  Sparkles, 
  Braces, 
  Zap, 
  ChevronDown, 
  ChevronRight,
  Settings,
  Camera,
  Palette,
  Clapperboard,
  Box,
  Sun,
  MapPin,
  Smile,
  Trash2,
  Download,
  Plus,
  X,
  Eye,
  EyeOff,
  Dices,
  Lock,
  Unlock,
  Layers,
  MonitorPlay
} from 'lucide-react';
import FluidBackground from './components/FluidBackground';
import { VisualPromptState } from './types';

// --- Constants & Options ---

const DEFAULT_STATE: VisualPromptState = {
  positive_prompt: "",
  negative_prompt: "",
  core: { seed: -1, steps: 30, guidance_scale: 7.5, temperature: 1.0, cfg_rescale: 0.0 },
  dimensions: { aspect_ratio: "1:1", width: 1024, height: 1024, quality: "Standard" },
  style: { medium: "None", style_preset: "None" },
  camera: { camera_type: "None", lens_type: "None", shot_type: "None", angle: "None", focus: "None", composition: "None", aperture: "None", depth_of_field: "None", blur_style: "None" },
  video: { duration: 2, fps: 24, motion: "None", motion_direction: "None", frame_interpolation: false },
  material: { made_out_of: "None", secondary_material: "None" },
  lighting: { lighting_style: "None" },
  color: { color_grade: "None" },
  location: { era: "None", environment: "None", location: "None", season: "None", mood: "None" },
  face: { gender: "None", makeup: "None", mood: "None" },
  enhancements: { prevent_deformities: true, upscale_factor: 1, keep_typographic: false, quality_booster: false, enhance_reflections: false, keep_key_details: true },
  hyperrealism: { positive_adds: [], negative_adds: [] }
};

const INITIAL_DROPDOWN_OPTIONS: Record<string, string[]> = {
  aspect_ratio: ["1:1", "16:9", "9:16", "4:3", "3:4", "21:9", "2:3", "3:2"],
  medium: ["None", "Photography", "Digital Art", "Oil Painting", "3D Render", "Anime", "Concept Art", "Watercolor", "Sketch", "Vector", "Claymation"],
  style_preset: [
    "None",
    "HDR",
    "Aerial/Drone",
    "Black and White",
    "Blue Hour",
    "Bokeh",
    "Cinematic",
    "Documentary",
    "Editorial Photo",
    "Film Still",
    "Golden Hour",
    "High Contrast",
    "Infrared",
    "Lomography",
    "Macro",
    "Old iPhone",
    "Polaroid",
    "Retro",
    "Sepia",
    "Soft Focus",
    "Tilt-Shift",
    "Timelapse",
    "Ultraviolet",
    "Vintage Photo"
  ],
  camera_type: [
    "None",
    "360 camera (panoramic, immersive)",
    "AI camera (smart, auto-enhanced)",
    "Blackmagic Pocket Cinema Camera 6K",
    "Blackmagic URSA Mini Pro 12K",
    "DJI Mavic 3 (drone camera)",
    "DJI Osmo Pocket (portable gimbal)",
    "DSLR (digital single-lens reflex)",
    "Fujifilm GFX100 (medium format)",
    "Fujifilm X-T5 (APS-C mirrorless)",
    "GoPro HERO12 Black (action camera)",
    "GoPro Max (360 action cam)",
    "IMAX camera (ultra-wide, blockbuster)",
    "Nikon D6 (pro DSLR)",
    "Nikon F6 (classic film SLR)",
    "Nikon Z9 (flagship mirrorless)",
    "Panasonic GH6 (hybrid mirrorless)",
    "Panasonic S1H (cinema mirrorless)",
    "RED Helium 8K (legendary cinema)",
    "RED Komodo (compact cinema)",
    "RED V-Raptor (high-end cinema)",
    "SLR (film single-lens reflex)",
    "Sony Alpha 1 (flagship mirrorless)",
    "Sony Alpha 7R V (high-res full-frame)",
    "Sony FX6 (cinema line)",
    "Sony Venice (digital cinema camera)",
    "action camera (GoPro, sports)",
    "body camera (POV, documentary)",
    "box camera (early 20th century style)",
    "bridge camera (hybrid zoom)",
    "camcorder (video, home movies)",
    "cinema camera (professional movie making)",
    "dashcam (in-car, wide angle)",
    "default (auto/any camera)",
    "digital back (pro, modular studio)",
    "disposable camera (lo-fi, retro)",
    "drone camera (aerial, birds-eye)",
    "field camera (large format outdoor)",
    "film camera (general analog)",
    "folding camera (vintage portable)",
    "handheld camcorder (retro video)",
    "holographic camera (sci-fi, virtual capture)",
    "infrared camera (night vision, special effect)",
    "instant camera (Polaroid, Instax style)",
    "large format (fine art, tilt/shift)",
    "medium format (pro, ultra high-res)",
    "mirrorless (compact, digital interchangeable lens)",
    "modular camera system (customizable pro)",
    "night vision camera (low-light scenes)",
    "old handheld camera (vintage, shaky aesthetic)",
    "old iPhone camera (retro digital look)",
    "old phone camera (lo-fi, nostalgic)",
    "panoramic camera (wide landscapes)",
    "pinhole camera (experimental, soft focus)",
    "point and shoot (compact, easy use)",
    "rangefinder (classic street photography)",
    "robotic camera (automated, sci-fi)",
    "security camera (CCTV, fisheye)",
    "smartphone camera (modern, casual)",
    "stereo camera (3D, VR)",
    "studio camera (broadcast, TV)",
    "subminiature camera (spy, tiny format)",
    "super 8 camera (home movies, film grain)",
    "surveillance camera (hidden, covert)",
    "thermal camera (heat vision, IR effect)",
    "tilt-shift camera (architectural, creative DOF)",
    "toy camera (Holga, Diana, quirky looks)",
    "toy digital camera (kids, low-fi)",
    "twin-lens reflex (TLR, vintage)",
    "underwater camera (diving, marine shots)",
    "vhs camcorder (analog video aesthetic)",
    "webcam (lo-fi, candid)"
  ],
  lens_type: [
    "None",
    "Anamorphic 40mm",
    "Catadioptric 250mm",
    "Cinema 50mm",
    "Crystal 28mm",
    "Defocus 100mm",
    "Dual 35mm",
    "Fisheye 8mm",
    "Infrared 720nm",
    "Macro 100mm",
    "Micro 5mm",
    "Mirror 500mm",
    "Periscope 24mm",
    "Perspective Control 24mm",
    "Pinhole 35mm",
    "Plastic 35mm",
    "Portrait 85mm",
    "Prime 135mm",
    "Prime 35mm",
    "Prime 85mm",
    "Rectilinear 24mm",
    "Soft Focus 80mm",
    "Split Diopter 50mm",
    "Standard 50mm",
    "Super Telephoto 300mm",
    "Superzoom 18–200mm",
    "Telephoto 85mm",
    "Tilt-Shift 90mm",
    "Toy 22mm",
    "Ultra Wide 14mm",
    "Ultraviolet 365nm",
    "Vintage 35mm",
    "Wide 24mm",
    "Zoom 24–70mm"
  ],
  shot_type: [
    "None",
    "POV",
    "Aerial",
    "Bird's Eye",
    "Close-Up",
    "Cowboy",
    "Crane",
    "Cross",
    "Crowd",
    "Cut-In",
    "Cutaway",
    "Detail",
    "Dolly",
    "Drone",
    "Dutch Angle",
    "Establishing",
    "Extreme Close-Up",
    "Extreme Wide",
    "Freeze Frame",
    "Full",
    "Group",
    "High Angle",
    "Insert",
    "Insert Detail",
    "Isometric",
    "Long",
    "Low Angle",
    "Macro",
    "Medium",
    "Medium Close-Up",
    "Medium Long",
    "Mirror",
    "Mirror Image",
    "Motion Blur",
    "Objective",
    "Over-the-Shoulder",
    "Panorama",
    "Panoramic",
    "Point-of-View",
    "Profile",
    "Pull-Out",
    "Push-In",
    "Reaction",
    "Reflection",
    "Reverse Angle",
    "Slow Motion",
    "Split Screen",
    "Static",
    "Still",
    "Subjective",
    "Three Shot",
    "Tilted",
    "Time-Lapse",
    "Top-Down",
    "Tracking",
    "Two Shot",
    "Very Wide",
    "Wide",
    "Worm's Eye"
  ],
  lighting_style: ["None", "Natural", "Studio", "Cinematic", "Neon", "Bioluminescent", "Golden Hour", "Blue Hour", "Volumetric", "Rembrandt"],
  color_grade: [
    "None",
    "Agfa Ultra",
    "Autumn Tones",
    "Black And White",
    "Bleach Bypass",
    "Blockbuster",
    "Blue Hour",
    "Cinema Verité",
    "Cinematic",
    "Cinematic Blue",
    "Cinematic Green",
    "Cinematic Teal-Orange",
    "Classic Sepia",
    "Cool Matte",
    "Cool Shadows, Warm Highlights",
    "Cool Tones",
    "Cross-Processed",
    "Cyan Tint",
    "Day For Night",
    "De-Saturated Blues",
    "Default (no Specific Color Grading)",
    "Desaturated",
    "Dramatic",
    "Dreamy",
    "Duotone",
    "Earthy",
    "Ektar 100",
    "Emerald Green",
    "Ethereal",
    "Faded",
    "Film Grain",
    "Film Noir",
    "Fuji Classic Chrome",
    "Fuji Provia",
    "Fuji Velvia",
    "Fujifilm Eterna",
    "Giallo",
    "Golden Hour",
    "HDR",
    "High Contrast Black And White",
    "Icy Blue",
    "Icy Whites",
    "Infrared",
    "Infrared False Color",
    "Instax",
    "Kodachrome",
    "Kodak 2383",
    "Lomo",
    "Low Contrast Black And White",
    "Lush Greens",
    "Magenta Dream",
    "Matte",
    "Monochrome",
    "Moody",
    "Muted",
    "Muted Vintage",
    "Neon",
    "Neon Glow",
    "Night Blue",
    "Old Hollywood",
    "Orange And Teal",
    "Pastel",
    "Pastel Neon",
    "Polaroid",
    "Portra 400",
    "Portra 800",
    "Purple Haze",
    "Rec2020",
    "Rec709",
    "Red And Cyan",
    "Retro",
    "Rustic",
    "SDR",
    "Sepia",
    "Split Toning",
    "Spring Bloom",
    "Sunset Glow",
    "Teal And Orange",
    "Technicolor",
    "Tritone",
    "Ultra-Vivid",
    "Ultraviolet",
    "Vintage Film",
    "Vivid",
    "Vivid Pop",
    "Warm Highlights, Cool Shadows",
    "Warm Matte",
    "Warm Tones",
    "Washed Film",
    "Washed Out",
    "Xpro",
    "Yellow And Blue"
  ],
  era: ["None", "Ancient", "Medieval", "Victorian", "1920s", "1950s", "1980s", "Modern", "Future", "Cyberpunk Future"],
  motion: [
    "None",
    "Dolly In",
    "Dolly Out",
    "Pan Left",
    "Pan Right",
    "Tilt Up",
    "Tilt Down",
    "Zoom In",
    "Zoom Out",
    "Static"
  ],
  motion_direction: ["None", "Left", "Right", "Up", "Down", "In", "Out"],
  quality: ["Standard", "High", "Ultra", "Raw"],
  aperture: ["None", "f/1.4", "f/1.8", "f/2.8", "f/4", "f/8", "f/11", "f/16"],
  composition: [
    "None",
    "C-pattern",
    "L-curve",
    "S-curve",
    "Z-pattern",
    "asymmetry",
    "background interest",
    "balance",
    "bird's eye perspective",
    "breathing room",
    "centered composition",
    "closed composition",
    "clutter",
    "converging lines",
    "cropping",
    "diagonal method",
    "dynamic symmetry",
    "eye line",
    "eye-level perspective",
    "figure to ground",
    "fill the frame",
    "foreground interest",
    "frame within a frame",
    "framing",
    "golden ratio",
    "golden spiral",
    "high horizon",
    "implied lines",
    "isolated subject",
    "juxtaposition",
    "layering",
    "leading lines",
    "low horizon",
    "minimalism",
    "negative space",
    "odds rule",
    "open composition",
    "pattern",
    "positive space",
    "pyramid composition",
    "repetition",
    "rhythm",
    "rule of thirds",
    "symmetry",
    "texture",
    "tight crop",
    "triangular composition",
    "vanishing point",
    "visual flow",
    "visual weight",
    "worm's eye perspective"
  ],
  fps: ["12", "24", "30", "60"],
  environment: ["None", "Indoor", "Outdoor", "Space", "Underwater", "Studio"],
  season: ["None", "Spring", "Summer", "Autumn", "Winter"],
  gender: ["None", "Female", "Male", "Non-binary", "Androgynous"],
  mood: [
    "None", "Abandoned", "Abstract", "Adventurous", "Afternoon", "Airy", "Alive", "Ambient", "Ancient", "Angelic", 
    "Apocalyptic", "Arid", "Autumnal", "Beautiful", "Bleak", "Blissful", "Bright", "Brutal", "Calm", "Candid", 
    "Carefree", "Celestial", "Charming", "Cheerful", "Chilly", "Cold", "Colorful", "Comforting", "Contemplative", 
    "Cozy", "Creepy", "Crisp", "Crystalline", "Dark", "Dawn", "Deadly", "Delicate", "Desolate", "Dewy", "Dramatic", 
    "Dreamy", "Dusty", "Eerie", "Elegant", "Ethereal", "Evening", "Exciting", "Exotic", "Expressive", "Festive", 
    "Foggy", "Foreboding", "Forgotten", "Fresh", "Friendly", "Futuristic", "Ghostly", "Gloomy", "Grand", "Haunting", 
    "Hazy", "Heavenly", "Heroic", "Hopeful", "Hot", "Humid", "Hypnotic", "Intense", "Intimate", "Invigorating", 
    "Inviting", "Isolated", "Joyful", "Lonely", "Magical", "Melancholic", "Mild", "Misty", "Moody", "Mysterious", 
    "Mystical", "Noble", "Nostalgic", "Ominous", "Optimistic", "Otherworldly", "Passionate", "Peaceful", "Pensive", 
    "Playful", "Powerful", "Protected", "Psychedelic", "Rainy", "Refreshing", "Restless", "Romantic", "Sad", "Safe", 
    "Secretive", "Serene", "Shadowy", "Smoky", "Soft", "Somber", "Spooky", "Stifling", "Still", "Stormy", "Surreal", 
    "Suspenseful", "Tenebrous", "Tense", "Timeless", "Timid", "Tranquil", "Uplifting", "Warm", "Welcoming", "Windy", 
    "Wistful"
  ],
  angle: ["None", "Eye Level", "Low Angle", "High Angle", "Dutch Angle"],
  focus: ["None", "Sharp", "Soft", "Deep", "Shallow"],
  depth_of_field: ["None", "Shallow", "Deep"],
  blur_style: ["None", "Motion Blur", "Gaussian Blur", "Radial Blur"],
  made_out_of: ["None", "Plastic", "Metal", "Wood", "Glass", "Fabric", "Liquid"],
  secondary_material: ["None", "Gold", "Silver", "Neon", "Chrome"],
  location: ["None", "City", "Forest", "Desert", "Ocean", "Mountain", "Room"],
  makeup: ["None", "Natural", "Heavy", "Goth", "Clown", "Tribal"],
  character_mood: ["None", "Happy", "Sad", "Angry", "Stoic", "Fearful"]
};

const HYPERREALISM_POSITIVE = [
  "Amateur photography",
  "Captured on android phone",
  "Boring reality",
  "Candid",
  "23 mm focal length",
  "Detailed realism",
  "Washed out",
  "Add tiny imperfections",
  "Slight JPEG artifacts",
  "Grain in dark areas",
  "Overexposed",
  "Underexposed",
  "Unpolished"
];

const HYPERREALISM_NEGATIVE = [
  "No intense colors",
  "No intense filters",
  "No cinematic vibe",
  "No background Blur",
  "No perfect composition",
  "Do not exactly center subject",
  "No vignette",
  "Retain Structural Fidelity",
  "Retain Logo Accuracy",
  "Retain Text Accuracy"
];

// Default active sections (Core and Dimensions usually essential)
const DEFAULT_ACTIVE_SECTIONS = {
  core: true,
  dimensions: true,
  style: false,
  camera: false,
  video: false,
  material: false,
  lighting: false,
  color: false,
  location: false,
  face: false,
  enhancements: false,
  hyperrealism: false
};

// --- Components ---

const AccordionItem: React.FC<{
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  isActive: boolean;
  onToggleActive: (e: React.MouseEvent) => void;
}> = ({ title, icon: Icon, children, isOpen, onToggle, isActive, onToggleActive }) => (
  <div className={`border rounded-xl overflow-hidden transition-all duration-300 mb-3 ${isActive ? 'bg-[#111] border-zinc-400' : 'bg-black/40 border-white/5 opacity-70'}`}>
    <div className="w-full flex items-center p-4 hover:bg-white/5 transition-colors">
      {/* Checkbox for Activation */}
      <button 
        onClick={onToggleActive}
        className={`mr-4 w-5 h-5 rounded border flex items-center justify-center transition-all ${
          isActive 
            ? 'bg-[#976cd0] border-[#976cd0] text-black' 
            : 'bg-transparent border-zinc-400 text-transparent hover:border-zinc-200'
        }`}
        title={isActive ? "Deactivate Section" : "Activate Section"}
      >
        <Check className="w-3.5 h-3.5" strokeWidth={3} />
      </button>

      {/* Expand/Collapse Click Area */}
      <button onClick={onToggle} className="flex-1 flex items-center justify-between text-left group">
        <div className="flex items-center gap-3">
          <Icon className={`w-5 h-5 ${isActive ? 'text-[#976cd0]' : 'text-zinc-500'}`} />
          <span className={`font-semibold ${isActive ? 'text-white' : 'text-zinc-400 group-hover:text-zinc-200'}`}>{title}</span>
        </div>
        {isOpen ? <ChevronDown className="w-4 h-4 text-zinc-400" /> : <ChevronRight className="w-4 h-4 text-zinc-400" />}
      </button>
    </div>

    {/* Content */}
    <div className={`transition-all duration-300 ease-in-out ${isOpen && isActive ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
      <div className="p-4 pt-0 border-t border-white/5 grid grid-cols-1 md:grid-cols-2 gap-4">
        {children}
      </div>
    </div>
  </div>
);

const InputField: React.FC<{
  label: string;
  value: any;
  onChange: (val: any) => void;
  type?: "text" | "number" | "range" | "checkbox";
  min?: number;
  max?: number;
  step?: number;
  options?: string[];
  suffix?: string;
  onAddCustomOption?: (val: string) => void;
}> = ({ label, value, onChange, type = "text", min, max, step, options, suffix, onAddCustomOption }) => {
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [customValue, setCustomValue] = useState("");

  const handleCustomSubmit = () => {
    if (customValue.trim() && onAddCustomOption) {
      onAddCustomOption(customValue.trim());
      onChange(customValue.trim());
      setIsCustomMode(false);
      setCustomValue("");
    } else {
      setIsCustomMode(false);
    }
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === "___CUSTOM___") {
      setIsCustomMode(true);
    } else {
      onChange(e.target.value);
    }
  };

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex justify-between items-center">
        <label className="text-xs font-medium text-zinc-400 uppercase tracking-wide">{label}</label>
        {isCustomMode && (
           <button 
             onClick={() => setIsCustomMode(false)}
             className="text-[10px] text-[#b83a1a] hover:text-[#b83a1a]/80 flex items-center gap-1"
           >
             <X className="w-3 h-3" /> Cancel
           </button>
        )}
      </div>
      
      {isCustomMode ? (
        <div className="flex gap-2">
          <input 
            autoFocus
            type="text"
            value={customValue}
            onChange={(e) => setCustomValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCustomSubmit()}
            placeholder="Enter custom value..."
            className="w-full bg-black border border-[#976cd0]/50 rounded-lg px-3 py-2 text-sm text-[#976cd0] focus:outline-none placeholder-[#976cd0]/30"
          />
          <button 
            onClick={handleCustomSubmit}
            className="px-3 py-2 bg-[#976cd0] hover:bg-[#865bc0] rounded-lg text-white"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      ) : options ? (
        <div className="relative group">
          <select 
            value={value}
            onChange={handleSelectChange}
            className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-[#976cd0]/50 appearance-none cursor-pointer hover:bg-zinc-900 transition-colors"
          >
            {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            <option value="___CUSTOM___" className="font-bold text-[#ffd22e] bg-zinc-900">+ Custom...</option>
          </select>
          <ChevronDown className="absolute right-3 top-2.5 w-4 h-4 text-zinc-500 pointer-events-none group-hover:text-[#976cd0] transition-colors" />
        </div>
      ) : type === "checkbox" ? (
        <button 
          onClick={() => onChange(!value)}
          className={`flex items-center justify-between w-full px-3 py-2 rounded-lg border transition-all ${value ? 'bg-[#976cd0]/10 border-[#976cd0]/50 text-[#976cd0]' : 'bg-black border-white/10 text-zinc-400'}`}
        >
          <span className="text-sm">{value ? "Enabled" : "Disabled"}</span>
          {value && <Check className="w-3.5 h-3.5" />}
        </button>
      ) : type === "range" ? (
        <div className="flex items-center gap-3">
          <input 
            type="range" 
            min={min} 
            max={max} 
            step={step} 
            value={value} 
            onChange={(e) => onChange(parseFloat(e.target.value))}
            className="flex-1 accent-[#976cd0] h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer"
          />
          <span className="text-xs font-mono text-[#976cd0] w-12 text-right">{value}{suffix}</span>
        </div>
      ) : (
        <input 
          type={type}
          value={value}
          onChange={(e) => onChange(type === 'number' ? parseFloat(e.target.value) : e.target.value)}
          className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-[#976cd0]/50 placeholder-zinc-600"
        />
      )}
    </div>
  );
};

// --- Main App ---

const App: React.FC = () => {
  // Initialize with a random seed
  const [state, setState] = useState<VisualPromptState>({
    ...DEFAULT_STATE,
    core: {
      ...DEFAULT_STATE.core,
      seed: Math.floor(Math.random() * 99999)
    }
  });
  
  const [activeSections, setActiveSections] = useState(DEFAULT_ACTIVE_SECTIONS);
  const [availableOptions, setAvailableOptions] = useState(INITIAL_DROPDOWN_OPTIONS);
  const [openSection, setOpenSection] = useState<string | null>('core');
  const [isSeedLocked, setIsSeedLocked] = useState(false);
  const [copied, setCopied] = useState(false);

  // Load custom options from local storage on mount
  useEffect(() => {
    try {
      const savedOptions = localStorage.getItem('json_prompt_custom_options');
      if (savedOptions) {
        const parsed = JSON.parse(savedOptions);
        setAvailableOptions(prev => {
          const merged = { ...prev };
          Object.keys(parsed).forEach(key => {
             if (merged[key]) {
               const newVals = parsed[key].filter((v: string) => !merged[key].includes(v));
               merged[key] = [...merged[key], ...newVals];
             } else {
               merged[key] = parsed[key];
             }
          });
          return merged;
        });
      }
    } catch (e) {
      console.error("Failed to load custom options", e);
    }
  }, []);

  const saveCustomOption = (fieldKey: string, newValue: string) => {
    setAvailableOptions(prev => {
      const currentList = prev[fieldKey] || [];
      if (currentList.includes(newValue)) return prev;

      const newList = [...currentList, newValue];
      const newState = { ...prev, [fieldKey]: newList };
      localStorage.setItem('json_prompt_custom_options', JSON.stringify(newState));
      
      return newState;
    });
  };

  const toggleSection = (id: string) => setOpenSection(prev => prev === id ? null : id);
  
  const toggleActiveSection = (e: React.MouseEvent, id: keyof typeof activeSections) => {
    e.stopPropagation();
    setActiveSections(prev => ({ ...prev, [id]: !prev[id] }));
    if (!activeSections[id]) {
        setOpenSection(id);
    }
  };

  const updateState = (category: keyof VisualPromptState, field: string, value: any) => {
    setState(prev => ({
      ...prev,
      [category]: typeof prev[category] === 'object' && !Array.isArray(prev[category]) ? {
        ...(prev[category] as object),
        [field]: value
      } : value
    }));
  };
  
  const toggleHyperrealism = (type: 'positive_adds' | 'negative_adds', value: string) => {
    setState(prev => {
      const currentList = prev.hyperrealism[type];
      const newList = currentList.includes(value)
        ? currentList.filter(item => item !== value)
        : [...currentList, value];
      
      return {
        ...prev,
        hyperrealism: {
          ...prev.hyperrealism,
          [type]: newList
        }
      };
    });
  };

  const generateNewSeed = () => {
    updateState('core', 'seed', Math.floor(Math.random() * 99999));
  };

  const getFilteredJson = () => {
    // Basic setup
    let finalPositive = state.positive_prompt;
    let finalNegative = state.negative_prompt;
    
    // Transpose Hyperrealism if active
    if (activeSections.hyperrealism) {
      const posAdds = state.hyperrealism.positive_adds.join(", ");
      const negAdds = state.hyperrealism.negative_adds.join(", ");
      
      if (posAdds) {
        finalPositive = finalPositive ? `${finalPositive}, ${posAdds}` : posAdds;
      }
      
      if (negAdds) {
        finalNegative = finalNegative ? `${finalNegative}, ${negAdds}` : negAdds;
      }
    }

    const final: any = {
      positive_prompt: finalPositive,
      negative_prompt: finalNegative,
    };

    Object.keys(activeSections).forEach(key => {
      // Skip hyperrealism in the object structure because we transposed it
      if (key === 'hyperrealism') return;

      if ((activeSections as any)[key]) {
        final[key] = (state as any)[key];
      }
    });

    return JSON.stringify(final, null, 2);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(getFilteredJson());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(getFilteredJson());
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "prompt.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const resetForm = () => {
    setState({
      ...DEFAULT_STATE,
      core: {
        ...DEFAULT_STATE.core,
        seed: Math.floor(Math.random() * 99999)
      }
    });
    setActiveSections(DEFAULT_ACTIVE_SECTIONS);
    setIsSeedLocked(false);
  };

  return (
    <div className="relative min-h-[100dvh] text-zinc-200 selection:bg-[#976cd0]/30 pb-20 overflow-hidden">
      <FluidBackground />
      
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-black/90 backdrop-blur-xl">
        <div className="max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-end">
          <div className="flex gap-3">
             <button onClick={resetForm} className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/5 text-sm font-medium text-zinc-400 transition-colors">
               <Trash2 className="w-4 h-4" />
               <span className="hidden sm:inline">Reset</span>
             </button>
             <button onClick={downloadJson} className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/5 text-sm font-medium text-zinc-400 transition-colors">
               <Download className="w-4 h-4" />
               <span className="hidden sm:inline">Export</span>
             </button>
             <button 
               onClick={copyToClipboard}
               className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${copied ? 'bg-[#ffd22e]/20 text-[#ffd22e]' : 'bg-white/10 hover:bg-white/20 text-white'}`}
             >
               {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
               {copied ? 'Copied' : 'Copy JSON'}
             </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-4 md:px-6 pt-6 flex flex-col lg:flex-row gap-6 relative z-10">
        
        {/* LEFT COLUMN: Controls */}
        <div className="flex-1 lg:max-w-[60%] xl:max-w-[65%] flex flex-col gap-4">
          
          {/* Prompt Section */}
          <div className="bg-[#111] border border-zinc-400 rounded-2xl p-5 backdrop-blur-sm shadow-xl">
            <div className="mb-4">
              <h2 className="text-sm font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
                Positive Prompt
              </h2>
            </div>
            <textarea
              value={state.positive_prompt}
              onChange={(e) => setState(prev => ({...prev, positive_prompt: e.target.value}))}
              placeholder="Describe your image in detail..."
              className="w-full h-24 bg-black border border-white/10 rounded-xl p-4 text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-[#976cd0]/50 transition-all resize-none font-medium mb-4"
            />
            
            <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Negative Prompt</h2>
            <textarea
              value={state.negative_prompt}
              onChange={(e) => setState(prev => ({...prev, negative_prompt: e.target.value}))}
              placeholder="What to exclude (e.g. blurry, low quality, deformed)..."
              className="w-full h-16 bg-black border border-white/10 rounded-xl p-3 text-zinc-300 placeholder-zinc-600 focus:outline-none focus:border-[#b83a1a]/50 transition-all resize-none text-sm"
            />
          </div>

          {/* Accordion Controls */}
          <div className="space-y-1">
            
            <AccordionItem 
              title="Core Settings" 
              icon={Settings} 
              isOpen={openSection === 'core'} 
              onToggle={() => toggleSection('core')}
              isActive={activeSections.core}
              onToggleActive={(e) => toggleActiveSection(e, 'core')}
            >
              {/* Custom Seed Control */}
              <div className="flex flex-col gap-1.5 mb-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-medium text-zinc-400 uppercase tracking-wide">Seed</label>
                  <label className="flex items-center gap-2 cursor-pointer group select-none">
                    <span className={`text-[10px] transition-colors ${isSeedLocked ? 'text-[#ffd22e] font-bold' : 'text-zinc-500 group-hover:text-zinc-300'}`}>
                      {isSeedLocked ? 'Seed Locked' : 'Lock Seed'}
                    </span>
                    <button 
                      onClick={() => setIsSeedLocked(!isSeedLocked)}
                      className={`p-1 rounded-md transition-all ${isSeedLocked ? 'bg-[#ffd22e]/20 text-[#ffd22e]' : 'bg-black text-zinc-500 hover:text-zinc-300'}`}
                    >
                      {isSeedLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                    </button>
                  </label>
                </div>
                
                <div className="flex gap-2">
                  <div className="relative flex-1 group">
                    <input 
                      type="number"
                      value={state.core.seed}
                      readOnly={!isSeedLocked}
                      onChange={(e) => updateState('core', 'seed', parseInt(e.target.value))}
                      className={`w-full bg-black border rounded-lg px-3 py-2 text-sm focus:outline-none transition-all ${
                        isSeedLocked 
                          ? 'border-[#ffd22e]/50 text-[#ffd22e] placeholder-[#ffd22e]/30' 
                          : 'border-white/10 text-zinc-500 cursor-not-allowed opacity-80'
                      }`}
                    />
                    {!isSeedLocked && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-zinc-600 font-mono pointer-events-none flex items-center gap-1">
                        <Zap className="w-3 h-3" /> AUTO
                      </div>
                    )}
                  </div>
                  
                  {!isSeedLocked && (
                    <button 
                      onClick={generateNewSeed}
                      className="px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-zinc-400 hover:text-[#ffd22e] transition-colors group"
                      title="Randomize Seed"
                    >
                      <Dices className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" /> 
                    </button>
                  )}
                </div>
                <div className="text-[10px] text-zinc-500 px-1">
                  {isSeedLocked ? 'Using fixed seed for consistency.' : 'Random seed generated (0-99999).'}
                </div>
              </div>

              <InputField label="Steps" value={state.core.steps} type="range" min={10} max={150} step={1} onChange={(v) => updateState('core', 'steps', v)} />
              <InputField label="Guidance Scale (CFG)" value={state.core.guidance_scale} type="range" min={1} max={20} step={0.5} onChange={(v) => updateState('core', 'guidance_scale', v)} />
              <InputField label="Temperature" value={state.core.temperature} type="number" step={0.1} onChange={(v) => updateState('core', 'temperature', v)} />
              <InputField label="CFG Rescale" value={state.core.cfg_rescale} type="number" step={0.1} onChange={(v) => updateState('core', 'cfg_rescale', v)} />
            </AccordionItem>

            <AccordionItem 
              title="Dimensions & Format" 
              icon={Box} 
              isOpen={openSection === 'dimensions'} 
              onToggle={() => toggleSection('dimensions')}
              isActive={activeSections.dimensions}
              onToggleActive={(e) => toggleActiveSection(e, 'dimensions')}
            >
              <InputField label="Aspect Ratio" value={state.dimensions.aspect_ratio} options={availableOptions.aspect_ratio} onChange={(v) => updateState('dimensions', 'aspect_ratio', v)} onAddCustomOption={(v) => saveCustomOption('aspect_ratio', v)} />
              <InputField label="Quality" value={state.dimensions.quality} options={availableOptions.quality} onChange={(v) => updateState('dimensions', 'quality', v)} onAddCustomOption={(v) => saveCustomOption('quality', v)} />
              <InputField label="Width" value={state.dimensions.width} type="number" onChange={(v) => updateState('dimensions', 'width', v)} />
              <InputField label="Height" value={state.dimensions.height} type="number" onChange={(v) => updateState('dimensions', 'height', v)} />
            </AccordionItem>
            
            <AccordionItem 
              title="Hyperrealism Features" 
              icon={Eye} 
              isOpen={openSection === 'hyperrealism'} 
              onToggle={() => toggleSection('hyperrealism')}
              isActive={activeSections.hyperrealism}
              onToggleActive={(e) => toggleActiveSection(e, 'hyperrealism')}
            >
              <div className="col-span-full space-y-4">
                
                {/* Positive Adds */}
                <div>
                  <h4 className="text-xs font-bold text-[#976cd0] uppercase tracking-wide mb-3 flex items-center gap-2">
                    <Plus className="w-3 h-3" /> Positive Adds
                  </h4>
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
                    {HYPERREALISM_POSITIVE.map(opt => (
                      <button
                        key={opt}
                        onClick={() => toggleHyperrealism('positive_adds', opt)}
                        className={`text-xs px-3 py-2 rounded-lg border text-left transition-all truncate ${
                          state.hyperrealism.positive_adds.includes(opt)
                            ? 'bg-[#976cd0]/20 border-[#976cd0]/50 text-[#976cd0]'
                            : 'bg-black/40 border-white/5 text-zinc-400 hover:bg-white/5'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Negative Adds */}
                <div>
                  <h4 className="text-xs font-bold text-[#b83a1a] uppercase tracking-wide mb-3 flex items-center gap-2">
                    <EyeOff className="w-3 h-3" /> Negative Adds
                  </h4>
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
                    {HYPERREALISM_NEGATIVE.map(opt => (
                      <button
                        key={opt}
                        onClick={() => toggleHyperrealism('negative_adds', opt)}
                        className={`text-xs px-3 py-2 rounded-lg border text-left transition-all truncate ${
                          state.hyperrealism.negative_adds.includes(opt)
                            ? 'bg-[#b83a1a]/20 border-[#b83a1a]/50 text-[#b83a1a]'
                            : 'bg-black/40 border-white/5 text-zinc-400 hover:bg-white/5'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            </AccordionItem>

            <AccordionItem 
              title="Style Preset" 
              icon={Palette} 
              isOpen={openSection === 'style'} 
              onToggle={() => toggleSection('style')}
              isActive={activeSections.style}
              onToggleActive={(e) => toggleActiveSection(e, 'style')}
            >
              <InputField label="Medium" value={state.style.medium} options={availableOptions.medium} onChange={(v) => updateState('style', 'medium', v)} onAddCustomOption={(v) => saveCustomOption('medium', v)} />
              <InputField label="Style" value={state.style.style_preset} options={availableOptions.style_preset} onChange={(v) => updateState('style', 'style_preset', v)} onAddCustomOption={(v) => saveCustomOption('style_preset', v)} />
            </AccordionItem>

            <AccordionItem 
              title="Camera & Composition" 
              icon={Camera} 
              isOpen={openSection === 'camera'} 
              onToggle={() => toggleSection('camera')}
              isActive={activeSections.camera}
              onToggleActive={(e) => toggleActiveSection(e, 'camera')}
            >
              <InputField label="Camera Type" value={state.camera.camera_type} options={availableOptions.camera_type} onChange={(v) => updateState('camera', 'camera_type', v)} onAddCustomOption={(v) => saveCustomOption('camera_type', v)} />
              <InputField label="Lens Type" value={state.camera.lens_type} options={availableOptions.lens_type} onChange={(v) => updateState('camera', 'lens_type', v)} onAddCustomOption={(v) => saveCustomOption('lens_type', v)} />
              <InputField label="Shot Type" value={state.camera.shot_type} options={availableOptions.shot_type} onChange={(v) => updateState('camera', 'shot_type', v)} onAddCustomOption={(v) => saveCustomOption('shot_type', v)} />
              <InputField label="Aperture" value={state.camera.aperture} options={availableOptions.aperture} onChange={(v) => updateState('camera', 'aperture', v)} onAddCustomOption={(v) => saveCustomOption('aperture', v)} />
              <InputField label="Camera Angle" value={state.camera.angle} options={availableOptions.angle} onChange={(v) => updateState('camera', 'angle', v)} onAddCustomOption={(v) => saveCustomOption('angle', v)} />
              <InputField label="Subject Focus" value={state.camera.focus} options={availableOptions.focus} onChange={(v) => updateState('camera', 'focus', v)} onAddCustomOption={(v) => saveCustomOption('focus', v)} />
              <InputField label="Composition" value={state.camera.composition} options={availableOptions.composition} onChange={(v) => updateState('camera', 'composition', v)} onAddCustomOption={(v) => saveCustomOption('composition', v)} />
              <InputField label="Depth of Field" value={state.camera.depth_of_field} options={availableOptions.depth_of_field} onChange={(v) => updateState('camera', 'depth_of_field', v)} onAddCustomOption={(v) => saveCustomOption('depth_of_field', v)} />
              <InputField label="Blur Style" value={state.camera.blur_style} options={availableOptions.blur_style} onChange={(v) => updateState('camera', 'blur_style', v)} onAddCustomOption={(v) => saveCustomOption('blur_style', v)} />
            </AccordionItem>

            <AccordionItem 
              title="Video & Motion" 
              icon={Clapperboard} 
              isOpen={openSection === 'video'} 
              onToggle={() => toggleSection('video')}
              isActive={activeSections.video}
              onToggleActive={(e) => toggleActiveSection(e, 'video')}
            >
              <InputField label="Duration (s)" value={state.video.duration} type="number" onChange={(v) => updateState('video', 'duration', v)} />
              <InputField label="FPS" value={state.video.fps} options={availableOptions.fps} onChange={(v) => updateState('video', 'fps', parseInt(v))} />
              <InputField label="Camera Motion" value={state.video.motion} options={availableOptions.motion} onChange={(v) => updateState('video', 'motion', v)} onAddCustomOption={(v) => saveCustomOption('motion', v)} />
              <InputField label="Motion Direction" value={state.video.motion_direction} options={availableOptions.motion_direction} onChange={(v) => updateState('video', 'motion_direction', v)} onAddCustomOption={(v) => saveCustomOption('motion_direction', v)} />
              <InputField label="Frame Interpolation" value={state.video.frame_interpolation} type="checkbox" onChange={(v) => updateState('video', 'frame_interpolation', v)} />
            </AccordionItem>

            <AccordionItem 
              title="Material" 
              icon={Layers} 
              isOpen={openSection === 'material'} 
              onToggle={() => toggleSection('material')}
              isActive={activeSections.material}
              onToggleActive={(e) => toggleActiveSection(e, 'material')}
            >
              <InputField label="Made Out Of" value={state.material.made_out_of} options={availableOptions.made_out_of} onChange={(v) => updateState('material', 'made_out_of', v)} onAddCustomOption={(v) => saveCustomOption('made_out_of', v)} />
              <InputField label="Secondary Material" value={state.material.secondary_material} options={availableOptions.secondary_material} onChange={(v) => updateState('material', 'secondary_material', v)} onAddCustomOption={(v) => saveCustomOption('secondary_material', v)} />
            </AccordionItem>

            <AccordionItem 
              title="Lighting" 
              icon={Sun} 
              isOpen={openSection === 'lighting'} 
              onToggle={() => toggleSection('lighting')}
              isActive={activeSections.lighting}
              onToggleActive={(e) => toggleActiveSection(e, 'lighting')}
            >
              <InputField label="Lighting Style" value={state.lighting.lighting_style} options={availableOptions.lighting_style} onChange={(v) => updateState('lighting', 'lighting_style', v)} onAddCustomOption={(v) => saveCustomOption('lighting_style', v)} />
            </AccordionItem>

            <AccordionItem 
              title="Color Grading" 
              icon={MonitorPlay} 
              isOpen={openSection === 'color'} 
              onToggle={() => toggleSection('color')}
              isActive={activeSections.color}
              onToggleActive={(e) => toggleActiveSection(e, 'color')}
            >
              <InputField label="Color Grade" value={state.color.color_grade} options={availableOptions.color_grade} onChange={(v) => updateState('color', 'color_grade', v)} onAddCustomOption={(v) => saveCustomOption('color_grade', v)} />
            </AccordionItem>

            <AccordionItem 
              title="Setting & Location" 
              icon={MapPin} 
              isOpen={openSection === 'location'} 
              onToggle={() => toggleSection('location')}
              isActive={activeSections.location}
              onToggleActive={(e) => toggleActiveSection(e, 'location')}
            >
               <InputField label="Era" value={state.location.era} options={availableOptions.era} onChange={(v) => updateState('location', 'era', v)} onAddCustomOption={(v) => saveCustomOption('era', v)} />
               <InputField label="Environment" value={state.location.environment} options={availableOptions.environment} onChange={(v) => updateState('location', 'environment', v)} onAddCustomOption={(v) => saveCustomOption('location', v)} />
               <InputField label="Location" value={state.location.location} options={availableOptions.location} onChange={(v) => updateState('location', 'location', v)} onAddCustomOption={(v) => saveCustomOption('location', v)} />
               <InputField label="Season" value={state.location.season} options={availableOptions.season} onChange={(v) => updateState('location', 'season', v)} onAddCustomOption={(v) => saveCustomOption('season', v)} />
               <InputField label="Atmosphere / Mood" value={state.location.mood} options={availableOptions.mood} onChange={(v) => updateState('location', 'mood', v)} onAddCustomOption={(v) => saveCustomOption('mood', v)} />
            </AccordionItem>

            <AccordionItem 
              title="Face" 
              icon={Smile} 
              isOpen={openSection === 'face'} 
              onToggle={() => toggleSection('face')}
              isActive={activeSections.face}
              onToggleActive={(e) => toggleActiveSection(e, 'face')}
            >
               <InputField label="Gender" value={state.face.gender} options={availableOptions.gender} onChange={(v) => updateState('face', 'gender', v)} onAddCustomOption={(v) => saveCustomOption('face', v)} />
               <InputField label="Makeup Style" value={state.face.makeup} options={availableOptions.makeup} onChange={(v) => updateState('face', 'makeup', v)} onAddCustomOption={(v) => saveCustomOption('makeup', v)} />
               <InputField label="Character Mood" value={state.face.mood} options={availableOptions.character_mood} onChange={(v) => updateState('face', 'mood', v)} onAddCustomOption={(v) => saveCustomOption('character_mood', v)} />
            </AccordionItem>

            <AccordionItem 
              title="Enhancements" 
              icon={Sparkles} 
              isOpen={openSection === 'enhancements'} 
              onToggle={() => toggleSection('enhancements')}
              isActive={activeSections.enhancements}
              onToggleActive={(e) => toggleActiveSection(e, 'enhancements')}
            >
               <InputField label="Prevent Deformities" value={state.enhancements.prevent_deformities} type="checkbox" onChange={(v) => updateState('enhancements', 'prevent_deformities', v)} />
               <InputField label="Keep Typographic Details" value={state.enhancements.keep_typographic} type="checkbox" onChange={(v) => updateState('enhancements', 'keep_typographic', v)} />
               <InputField label="Quality Booster" value={state.enhancements.quality_booster} type="checkbox" onChange={(v) => updateState('enhancements', 'quality_booster', v)} />
               <InputField label="Enhance Reflections" value={state.enhancements.enhance_reflections} type="checkbox" onChange={(v) => updateState('enhancements', 'enhance_reflections', v)} />
               <InputField label="Keep Key Details" value={state.enhancements.keep_key_details} type="checkbox" onChange={(v) => updateState('enhancements', 'keep_key_details', v)} />
               <InputField label="Upscale Factor" value={state.enhancements.upscale_factor} type="range" min={1} max={4} step={1} onChange={(v) => updateState('enhancements', 'upscale_factor', v)} suffix="x" />
            </AccordionItem>

          </div>
        </div>

        {/* RIGHT COLUMN: JSON Output */}
        <div className="flex-1 lg:max-w-[40%] xl:max-w-[35%] relative">
          <div className="sticky top-24 space-y-4">
            <div className="bg-[#111] border border-white/10 rounded-2xl p-6 backdrop-blur-sm shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-50 group-hover:opacity-100 transition-opacity">
                <div className="bg-black p-2 rounded-lg">
                  <Braces className="w-6 h-6 text-zinc-500" />
                </div>
              </div>
              <h2 className="text-sm font-bold text-zinc-300 uppercase tracking-wider mb-4">Live JSON Preview</h2>
              
              <div className="relative">
                <pre className="custom-scrollbar bg-black p-4 rounded-xl text-xs md:text-sm font-mono text-[#976cd0] overflow-x-auto max-h-[70vh] border border-white/5 shadow-inner">
                  {getFilteredJson()}
                </pre>
                
                {copied && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-[2px] rounded-xl transition-all">
                    <div className="bg-[#ffd22e] text-black font-bold px-4 py-2 rounded-full flex items-center gap-2 shadow-lg scale-110">
                      <Check className="w-4 h-4" /> Copied!
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-4 flex gap-2">
                <button 
                  onClick={copyToClipboard}
                  className="flex-1 bg-[#976cd0] hover:bg-[#865bc0] text-white font-bold py-3 px-4 rounded-xl transition-colors shadow-lg shadow-[#976cd0]/20 flex items-center justify-center gap-2"
                >
                  <Copy className="w-4 h-4" /> Copy JSON
                </button>
              </div>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
};

export default App;
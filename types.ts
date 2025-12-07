/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

export interface VisualPromptState {
  positive_prompt: string;
  negative_prompt: string;
  core: {
    seed: number;
    steps: number;
    guidance_scale: number;
    temperature: number;
    cfg_rescale: number;
  };
  dimensions: {
    aspect_ratio: string;
    width: number;
    height: number;
    quality: string;
  };
  style: {
    medium: string;
    style_preset: string;
  };
  camera: {
    camera_type: string;
    lens_type: string;
    shot_type: string;
    angle: string;
    focus: string;
    composition: string;
    aperture: string;
    depth_of_field: string;
    blur_style: string;
  };
  video: {
    duration: number;
    fps: number;
    motion: string;
    motion_direction: string;
    frame_interpolation: boolean;
  };
  material: {
    made_out_of: string;
    secondary_material: string;
  };
  lighting: {
    lighting_style: string;
  };
  color: {
    color_grade: string;
  };
  location: {
    era: string;
    environment: string;
    location: string;
    season: string;
    mood: string;
  };
  face: {
    gender: string;
    makeup: string;
    mood: string;
  };
  enhancements: {
    prevent_deformities: boolean;
    upscale_factor: number;
    keep_typographic: boolean;
    quality_booster: boolean;
    enhance_reflections: boolean;
    keep_key_details: boolean;
  };
  hyperrealism: {
    positive_adds: string[];
    negative_adds: string[];
  };
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface Artist {
  id: string;
  name: string;
  image: string;
  day: string;
  genre: string;
}
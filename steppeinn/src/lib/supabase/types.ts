export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Enums: {
      user_role: "client" | "owner" | "admin";
      property_status:
        | "draft"
        | "pending"
        | "published"
        | "rejected"
        | "changes_requested"
        | "expired";
      booking_status:
        | "pending"
        | "confirmed"
        | "declined"
        | "cancelled"
        | "completed";
      location_category:
        | "attraction"
        | "shopping"
        | "transport"
        | "business"
        | "recreation";
    };
    Tables: {
      profiles: {
        Row: {
          id: string;
          role: Database["public"]["Enums"]["user_role"];
          full_name: string | null;
          phone: string | null;
          preferred_language: string | null;
          city: string | null;
          country: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          role?: Database["public"]["Enums"]["user_role"];
          full_name?: string | null;
          phone?: string | null;
          preferred_language?: string | null;
          city?: string | null;
          country?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
        Relationships: [];
      };
      properties: {
        Row: {
          id: string;
          owner_id: string;
          city_id: string | null;
          location_id: string | null;
          name: string;
          slug: string;
          short_description: string | null;
          description: string | null;
          description_en: string | null;
          description_ru: string | null;
          description_kk: string | null;
          address: string | null;
          city: string;
          property_type: string;
          latitude: number | null;
          longitude: number | null;
          status: Database["public"]["Enums"]["property_status"];
          submitted_at: string | null;
          moderated_at: string | null;
          moderated_by: string | null;
          moderation_notes: string | null;
          published_at: string | null;
          expires_at: string | null;
          tariff_id: string | null;
          billing_status: string | null;
          billing_period_started_at: string | null;
          billing_period_ends_at: string | null;
          rating: number | null;
          price_from: number | null;
          amenities: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          owner_id: string;
          city_id?: string | null;
          location_id?: string | null;
          name: string;
          slug: string;
          short_description?: string | null;
          description?: string | null;
          description_en?: string | null;
          description_ru?: string | null;
          description_kk?: string | null;
          address?: string | null;
          city?: string;
          property_type: string;
          latitude?: number | null;
          longitude?: number | null;
          status?: Database["public"]["Enums"]["property_status"];
          submitted_at?: string | null;
          moderated_at?: string | null;
          moderated_by?: string | null;
          moderation_notes?: string | null;
          published_at?: string | null;
          expires_at?: string | null;
          tariff_id?: string | null;
          billing_status?: string | null;
          billing_period_started_at?: string | null;
          billing_period_ends_at?: string | null;
          rating?: number | null;
          price_from?: number | null;
          amenities?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["properties"]["Insert"]>;
        Relationships: [];
      };
      property_media: GenericMediaTable;
      property_moderation_events: {
        Row: {
          id: string;
          property_id: string;
          admin_id: string | null;
          status: Database["public"]["Enums"]["property_status"];
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          property_id: string;
          admin_id?: string | null;
          status: Database["public"]["Enums"]["property_status"];
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["property_moderation_events"]["Insert"]
        >;
        Relationships: [];
      };
      rooms: {
        Row: {
          id: string;
          property_id: string;
          name: string;
          capacity: number;
          bed_type: string | null;
          size_m2: number | null;
          price_per_night: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          property_id: string;
          name: string;
          capacity: number;
          bed_type?: string | null;
          size_m2?: number | null;
          price_per_night: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["rooms"]["Insert"]>;
        Relationships: [];
      };
      room_media: GenericMediaTable;
      bookings: {
        Row: {
          id: string;
          property_id: string;
          room_id: string | null;
          client_id: string | null;
          guest_name: string;
          phone: string | null;
          email: string | null;
          check_in: string;
          check_out: string;
          guests: number;
          comment: string | null;
          status: Database["public"]["Enums"]["booking_status"];
          response_message: string | null;
          responded_at: string | null;
          status_changed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          property_id: string;
          room_id?: string | null;
          client_id?: string | null;
          guest_name: string;
          phone?: string | null;
          email?: string | null;
          check_in: string;
          check_out: string;
          guests: number;
          comment?: string | null;
          status?: Database["public"]["Enums"]["booking_status"];
          response_message?: string | null;
          responded_at?: string | null;
          status_changed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["bookings"]["Insert"]>;
        Relationships: [];
      };
      favorites: SimpleJoinTable;
      reviews: {
        Row: {
          id: string;
          property_id: string;
          client_id: string | null;
          rating: number;
          comment: string | null;
          is_visible: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          property_id: string;
          client_id?: string | null;
          rating: number;
          comment?: string | null;
          is_visible?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["reviews"]["Insert"]>;
        Relationships: [];
      };
      cities: {
        Row: {
          id: string;
          name: string;
          slug: string;
          region: string | null;
          country: string;
          latitude: number | null;
          longitude: number | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          region?: string | null;
          country?: string;
          latitude?: number | null;
          longitude?: number | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["cities"]["Insert"]>;
        Relationships: [];
      };
      locations: {
        Row: {
          id: string;
          city_id: string | null;
          name: string;
          category: Database["public"]["Enums"]["location_category"];
          description: string | null;
          description_en: string | null;
          description_ru: string | null;
          description_kk: string | null;
          latitude: number | null;
          longitude: number | null;
          metadata: Json | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          city_id?: string | null;
          name: string;
          category: Database["public"]["Enums"]["location_category"];
          description?: string | null;
          description_en?: string | null;
          description_ru?: string | null;
          description_kk?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          metadata?: Json | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["locations"]["Insert"]>;
        Relationships: [];
      };
      advertisements: NamedTable;
      tariffs: NamedTable;
    };
    Views: Record<string, never>;
    Functions: {
      nearby_properties: {
        Args: {
          search_latitude: number;
          search_longitude: number;
          radius_km?: number;
        };
        Returns: {
          id: string;
          name: string;
          slug: string;
          distance_km: number;
        }[];
      };
    };
    CompositeTypes: Record<string, never>;
  };
};

type GenericMediaTable = {
  Row: {
    id: string;
    property_id: string | null;
    room_id: string | null;
    url: string;
    media_type: string;
    alt_text: string | null;
    is_primary: boolean;
    sort_order: number;
    created_at: string;
    updated_at: string;
  };
  Insert: {
    id?: string;
    property_id?: string | null;
    room_id?: string | null;
    url: string;
    media_type: string;
    alt_text?: string | null;
    is_primary?: boolean;
    sort_order?: number;
    created_at?: string;
    updated_at?: string;
  };
  Update: Partial<GenericMediaTable["Insert"]>;
  Relationships: [];
};

type SimpleJoinTable = {
  Row: {
    id: string;
    client_id: string;
    property_id: string;
    created_at: string;
    updated_at: string;
  };
  Insert: {
    id?: string;
    client_id: string;
    property_id: string;
    created_at?: string;
    updated_at?: string;
  };
  Update: Partial<SimpleJoinTable["Insert"]>;
  Relationships: [];
};

type NamedTable = {
  Row: {
    id: string;
    name: string;
    description: string | null;
    metadata: Json | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
  };
  Insert: {
    id?: string;
    name: string;
    description?: string | null;
    metadata?: Json | null;
    is_active?: boolean;
    created_at?: string;
    updated_at?: string;
  };
  Update: Partial<NamedTable["Insert"]>;
  Relationships: [];
};

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '14.15'
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      audit_log: {
        Row: {
          criado_em: string
          dados_antigos: Json | null
          dados_novos: Json | null
          id: string
          operacao: string
          registro_id: string
          tabela: string
          usuario_id: string | null
        }
        Insert: {
          criado_em?: string
          dados_antigos?: Json | null
          dados_novos?: Json | null
          id?: string
          operacao: string
          registro_id: string
          tabela: string
          usuario_id?: string | null
        }
        Update: {
          criado_em?: string
          dados_antigos?: Json | null
          dados_novos?: Json | null
          id?: string
          operacao?: string
          registro_id?: string
          tabela?: string
          usuario_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'audit_log_usuario_id_fkey'
            columns: ['usuario_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      avms: {
        Row: {
          area_m2: number | null
          classe_funcional: Database['public']['Enums']['avm_classe_funcional']
          created_at: string
          created_by: string | null
          id: string
          id_avm: string
          inspetor_id: string | null
          localizacao_descritiva: string | null
          nome: string
          perimetro: number | null
          responsavel: string | null
          setor_id: string
          status: Database['public']['Enums']['status_ciclo']
          subsetor: string | null
          unidade_id: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          area_m2?: number | null
          classe_funcional: Database['public']['Enums']['avm_classe_funcional']
          created_at?: string
          created_by?: string | null
          id?: string
          id_avm: string
          inspetor_id?: string | null
          localizacao_descritiva?: string | null
          nome: string
          perimetro?: number | null
          responsavel?: string | null
          setor_id: string
          status?: Database['public']['Enums']['status_ciclo']
          subsetor?: string | null
          unidade_id: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          area_m2?: number | null
          classe_funcional?: Database['public']['Enums']['avm_classe_funcional']
          created_at?: string
          created_by?: string | null
          id?: string
          id_avm?: string
          inspetor_id?: string | null
          localizacao_descritiva?: string | null
          nome?: string
          perimetro?: number | null
          responsavel?: string | null
          setor_id?: string
          status?: Database['public']['Enums']['status_ciclo']
          subsetor?: string | null
          unidade_id?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'avms_created_by_fkey'
            columns: ['created_by']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'avms_inspetor_id_fkey'
            columns: ['inspetor_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'avms_setor_id_fkey'
            columns: ['setor_id']
            isOneToOne: false
            referencedRelation: 'setores'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'avms_unidade_id_fkey'
            columns: ['unidade_id']
            isOneToOne: false
            referencedRelation: 'unidades'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'avms_updated_by_fkey'
            columns: ['updated_by']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      diagnosticos: {
        Row: {
          acesso_condicao_via: string | null
          acesso_observacoes: string | null
          acesso_pedestre: boolean | null
          acesso_restricoes: string | null
          acesso_veicular: boolean | null
          caracterizacao_observacoes: string | null
          condicao_acesso_nota: number | null
          condicao_acesso_obs: string | null
          condicao_infraestrutura_nota: number | null
          condicao_infraestrutura_obs: string | null
          condicao_interferencia_operacional_nota: number | null
          condicao_interferencia_operacional_obs: string | null
          condicao_limpeza_nota: number | null
          condicao_limpeza_obs: string | null
          condicao_meio_ambiente_nota: number | null
          condicao_meio_ambiente_obs: string | null
          condicao_seguranca_nota: number | null
          condicao_seguranca_obs: string | null
          condicao_vegetacao_nota: number | null
          condicao_vegetacao_obs: string | null
          condicoes_climaticas: string | null
          created_at: string
          created_by: string | null
          grau_obstaculos: string | null
          id: string
          inclinacao: string | null
          levantamento_id: string
          limpeza_acumulo_entulho: boolean | null
          limpeza_necessita_capina: boolean | null
          limpeza_nivel: string | null
          limpeza_observacoes: string | null
          limpeza_presenca_residuos: boolean | null
          limpeza_tipo_residuos: string | null
          meio_ambiente_categorias: string[]
          meio_ambiente_gate: boolean | null
          meio_ambiente_observacoes: string | null
          obstaculos: Json
          recursos_apoio_operacional: string | null
          recursos_auxiliares: number | null
          recursos_composicao_sugerida: string | null
          recursos_equipe_especializada: string | null
          recursos_jardineiros: number | null
          recursos_observacoes: string | null
          recursos_operadores: number | null
          seguranca_observacoes: string | null
          seguranca_perguntas: Json
          superficie: string | null
          topografia: string | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          acesso_condicao_via?: string | null
          acesso_observacoes?: string | null
          acesso_pedestre?: boolean | null
          acesso_restricoes?: string | null
          acesso_veicular?: boolean | null
          caracterizacao_observacoes?: string | null
          condicao_acesso_nota?: number | null
          condicao_acesso_obs?: string | null
          condicao_infraestrutura_nota?: number | null
          condicao_infraestrutura_obs?: string | null
          condicao_interferencia_operacional_nota?: number | null
          condicao_interferencia_operacional_obs?: string | null
          condicao_limpeza_nota?: number | null
          condicao_limpeza_obs?: string | null
          condicao_meio_ambiente_nota?: number | null
          condicao_meio_ambiente_obs?: string | null
          condicao_seguranca_nota?: number | null
          condicao_seguranca_obs?: string | null
          condicao_vegetacao_nota?: number | null
          condicao_vegetacao_obs?: string | null
          condicoes_climaticas?: string | null
          created_at?: string
          created_by?: string | null
          grau_obstaculos?: string | null
          id?: string
          inclinacao?: string | null
          levantamento_id: string
          limpeza_acumulo_entulho?: boolean | null
          limpeza_necessita_capina?: boolean | null
          limpeza_nivel?: string | null
          limpeza_observacoes?: string | null
          limpeza_presenca_residuos?: boolean | null
          limpeza_tipo_residuos?: string | null
          meio_ambiente_categorias?: string[]
          meio_ambiente_gate?: boolean | null
          meio_ambiente_observacoes?: string | null
          obstaculos?: Json
          recursos_apoio_operacional?: string | null
          recursos_auxiliares?: number | null
          recursos_composicao_sugerida?: string | null
          recursos_equipe_especializada?: string | null
          recursos_jardineiros?: number | null
          recursos_observacoes?: string | null
          recursos_operadores?: number | null
          seguranca_observacoes?: string | null
          seguranca_perguntas?: Json
          superficie?: string | null
          topografia?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          acesso_condicao_via?: string | null
          acesso_observacoes?: string | null
          acesso_pedestre?: boolean | null
          acesso_restricoes?: string | null
          acesso_veicular?: boolean | null
          caracterizacao_observacoes?: string | null
          condicao_acesso_nota?: number | null
          condicao_acesso_obs?: string | null
          condicao_infraestrutura_nota?: number | null
          condicao_infraestrutura_obs?: string | null
          condicao_interferencia_operacional_nota?: number | null
          condicao_interferencia_operacional_obs?: string | null
          condicao_limpeza_nota?: number | null
          condicao_limpeza_obs?: string | null
          condicao_meio_ambiente_nota?: number | null
          condicao_meio_ambiente_obs?: string | null
          condicao_seguranca_nota?: number | null
          condicao_seguranca_obs?: string | null
          condicao_vegetacao_nota?: number | null
          condicao_vegetacao_obs?: string | null
          condicoes_climaticas?: string | null
          created_at?: string
          created_by?: string | null
          grau_obstaculos?: string | null
          id?: string
          inclinacao?: string | null
          levantamento_id?: string
          limpeza_acumulo_entulho?: boolean | null
          limpeza_necessita_capina?: boolean | null
          limpeza_nivel?: string | null
          limpeza_observacoes?: string | null
          limpeza_presenca_residuos?: boolean | null
          limpeza_tipo_residuos?: string | null
          meio_ambiente_categorias?: string[]
          meio_ambiente_gate?: boolean | null
          meio_ambiente_observacoes?: string | null
          obstaculos?: Json
          recursos_apoio_operacional?: string | null
          recursos_auxiliares?: number | null
          recursos_composicao_sugerida?: string | null
          recursos_equipe_especializada?: string | null
          recursos_jardineiros?: number | null
          recursos_observacoes?: string | null
          recursos_operadores?: number | null
          seguranca_observacoes?: string | null
          seguranca_perguntas?: Json
          superficie?: string | null
          topografia?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'diagnosticos_created_by_fkey'
            columns: ['created_by']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'diagnosticos_levantamento_id_fkey'
            columns: ['levantamento_id']
            isOneToOne: true
            referencedRelation: 'levantamentos'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'diagnosticos_updated_by_fkey'
            columns: ['updated_by']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      equipamentos: {
        Row: {
          avaliacao: string
          created_at: string
          created_by: string | null
          id: string
          justificativa: string | null
          levantamento_id: string
          nome: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          avaliacao: string
          created_at?: string
          created_by?: string | null
          id?: string
          justificativa?: string | null
          levantamento_id: string
          nome: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          avaliacao?: string
          created_at?: string
          created_by?: string | null
          id?: string
          justificativa?: string | null
          levantamento_id?: string
          nome?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'equipamentos_created_by_fkey'
            columns: ['created_by']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'equipamentos_levantamento_id_fkey'
            columns: ['levantamento_id']
            isOneToOne: false
            referencedRelation: 'levantamentos'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'equipamentos_updated_by_fkey'
            columns: ['updated_by']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      evidencias: {
        Row: {
          avm_id: string
          created_at: string
          data_hora: string
          descricao: string | null
          id: string
          levantamento_id: string
          ocorrencia_id: string | null
          path_storage: string | null
          sequencia: number
          tipo: Database['public']['Enums']['evidencia_tipo'] | null
          updated_at: string
          updated_by: string | null
          usuario_id: string
        }
        Insert: {
          avm_id: string
          created_at?: string
          data_hora?: string
          descricao?: string | null
          id?: string
          levantamento_id: string
          ocorrencia_id?: string | null
          path_storage?: string | null
          sequencia?: number
          tipo?: Database['public']['Enums']['evidencia_tipo'] | null
          updated_at?: string
          updated_by?: string | null
          usuario_id?: string
        }
        Update: {
          avm_id?: string
          created_at?: string
          data_hora?: string
          descricao?: string | null
          id?: string
          levantamento_id?: string
          ocorrencia_id?: string | null
          path_storage?: string | null
          sequencia?: number
          tipo?: Database['public']['Enums']['evidencia_tipo'] | null
          updated_at?: string
          updated_by?: string | null
          usuario_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'evidencias_avm_id_fkey'
            columns: ['avm_id']
            isOneToOne: false
            referencedRelation: 'avms'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'evidencias_levantamento_id_fkey'
            columns: ['levantamento_id']
            isOneToOne: false
            referencedRelation: 'levantamentos'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'evidencias_ocorrencia_id_fkey'
            columns: ['ocorrencia_id']
            isOneToOne: false
            referencedRelation: 'ocorrencias'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'evidencias_updated_by_fkey'
            columns: ['updated_by']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'evidencias_usuario_id_fkey'
            columns: ['usuario_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      infraestrutura: {
        Row: {
          created_at: string
          created_by: string | null
          descricao: string | null
          existente: boolean | null
          id: string
          interferencia: boolean | null
          levantamento_id: string
          necessidade_intervencao: string | null
          tipo: string | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          descricao?: string | null
          existente?: boolean | null
          id?: string
          interferencia?: boolean | null
          levantamento_id: string
          necessidade_intervencao?: string | null
          tipo?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          descricao?: string | null
          existente?: boolean | null
          id?: string
          interferencia?: boolean | null
          levantamento_id?: string
          necessidade_intervencao?: string | null
          tipo?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'infraestrutura_created_by_fkey'
            columns: ['created_by']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'infraestrutura_levantamento_id_fkey'
            columns: ['levantamento_id']
            isOneToOne: true
            referencedRelation: 'levantamentos'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'infraestrutura_updated_by_fkey'
            columns: ['updated_by']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      interferencias: {
        Row: {
          created_at: string
          created_by: string | null
          descricao: string | null
          id: string
          levantamento_id: string
          tipo: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          descricao?: string | null
          id?: string
          levantamento_id: string
          tipo: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          descricao?: string | null
          id?: string
          levantamento_id?: string
          tipo?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'interferencias_created_by_fkey'
            columns: ['created_by']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'interferencias_levantamento_id_fkey'
            columns: ['levantamento_id']
            isOneToOne: false
            referencedRelation: 'levantamentos'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'interferencias_updated_by_fkey'
            columns: ['updated_by']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      levantamentos: {
        Row: {
          avm_id: string
          created_at: string
          created_by: string | null
          id: string
          inspetor_id: string
          status: Database['public']['Enums']['status_ciclo']
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          avm_id: string
          created_at?: string
          created_by?: string | null
          id?: string
          inspetor_id: string
          status?: Database['public']['Enums']['status_ciclo']
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          avm_id?: string
          created_at?: string
          created_by?: string | null
          id?: string
          inspetor_id?: string
          status?: Database['public']['Enums']['status_ciclo']
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'levantamentos_avm_id_fkey'
            columns: ['avm_id']
            isOneToOne: false
            referencedRelation: 'avms'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'levantamentos_created_by_fkey'
            columns: ['created_by']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'levantamentos_inspetor_id_fkey'
            columns: ['inspetor_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'levantamentos_updated_by_fkey'
            columns: ['updated_by']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      ocorrencias: {
        Row: {
          created_at: string
          created_by: string | null
          criticidade:
            Database['public']['Enums']['ocorrencia_criticidade'] | null
          descricao: string | null
          evidencia_id: string | null
          id: string
          levantamento_id: string
          origem_modulo: string | null
          origem_referencia: string | null
          responsavel: string | null
          status: Database['public']['Enums']['ocorrencia_status']
          tipo: Database['public']['Enums']['ocorrencia_tipo'] | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          criticidade?:
            Database['public']['Enums']['ocorrencia_criticidade'] | null
          descricao?: string | null
          evidencia_id?: string | null
          id?: string
          levantamento_id: string
          origem_modulo?: string | null
          origem_referencia?: string | null
          responsavel?: string | null
          status?: Database['public']['Enums']['ocorrencia_status']
          tipo?: Database['public']['Enums']['ocorrencia_tipo'] | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          criticidade?:
            Database['public']['Enums']['ocorrencia_criticidade'] | null
          descricao?: string | null
          evidencia_id?: string | null
          id?: string
          levantamento_id?: string
          origem_modulo?: string | null
          origem_referencia?: string | null
          responsavel?: string | null
          status?: Database['public']['Enums']['ocorrencia_status']
          tipo?: Database['public']['Enums']['ocorrencia_tipo'] | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'ocorrencias_created_by_fkey'
            columns: ['created_by']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'ocorrencias_evidencia_id_fkey'
            columns: ['evidencia_id']
            isOneToOne: false
            referencedRelation: 'evidencias'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'ocorrencias_levantamento_id_fkey'
            columns: ['levantamento_id']
            isOneToOne: false
            referencedRelation: 'levantamentos'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'ocorrencias_updated_by_fkey'
            columns: ['updated_by']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      profiles: {
        Row: {
          ativo: boolean
          created_at: string
          email: string
          id: string
          nome_completo: string
          perfil: Database['public']['Enums']['perfil_usuario'] | null
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          created_at?: string
          email: string
          id: string
          nome_completo?: string
          perfil?: Database['public']['Enums']['perfil_usuario'] | null
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          created_at?: string
          email?: string
          id?: string
          nome_completo?: string
          perfil?: Database['public']['Enums']['perfil_usuario'] | null
          updated_at?: string
        }
        Relationships: []
      }
      servicos: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          levantamento_id: string
          necessidade: string
          nome: string
          observacao: string | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          levantamento_id: string
          necessidade: string
          nome: string
          observacao?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          levantamento_id?: string
          necessidade?: string
          nome?: string
          observacao?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'servicos_created_by_fkey'
            columns: ['created_by']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'servicos_levantamento_id_fkey'
            columns: ['levantamento_id']
            isOneToOne: false
            referencedRelation: 'levantamentos'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'servicos_updated_by_fkey'
            columns: ['updated_by']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      setores: {
        Row: {
          ativo: boolean
          codigo: string | null
          created_at: string
          created_by: string | null
          id: string
          nome: string
          unidade_id: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          ativo?: boolean
          codigo?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          nome: string
          unidade_id: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          ativo?: boolean
          codigo?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          nome?: string
          unidade_id?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'setores_created_by_fkey'
            columns: ['created_by']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'setores_unidade_id_fkey'
            columns: ['unidade_id']
            isOneToOne: false
            referencedRelation: 'unidades'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'setores_updated_by_fkey'
            columns: ['updated_by']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      unidades: {
        Row: {
          ativo: boolean
          codigo: string | null
          created_at: string
          created_by: string | null
          id: string
          nome: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          ativo?: boolean
          codigo?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          nome: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          ativo?: boolean
          codigo?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          nome?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'unidades_created_by_fkey'
            columns: ['created_by']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'unidades_updated_by_fkey'
            columns: ['updated_by']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      validacoes: {
        Row: {
          acao: Database['public']['Enums']['validacao_acao']
          comentario: string | null
          created_at: string
          fiscal_id: string
          id: string
          levantamento_id: string
        }
        Insert: {
          acao: Database['public']['Enums']['validacao_acao']
          comentario?: string | null
          created_at?: string
          fiscal_id?: string
          id?: string
          levantamento_id: string
        }
        Update: {
          acao?: Database['public']['Enums']['validacao_acao']
          comentario?: string | null
          created_at?: string
          fiscal_id?: string
          id?: string
          levantamento_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'validacoes_fiscal_id_fkey'
            columns: ['fiscal_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'validacoes_levantamento_id_fkey'
            columns: ['levantamento_id']
            isOneToOne: false
            referencedRelation: 'levantamentos'
            referencedColumns: ['id']
          },
        ]
      }
      vegetacao: {
        Row: {
          altura: string | null
          arvores: string | null
          cobertura: string | null
          created_at: string
          created_by: string | null
          densidade: string | null
          especie: string | null
          id: string
          invasoras: string | null
          levantamento_id: string
          observacoes: string | null
          tipo: string | null
          uniformidade: string | null
          updated_at: string
          updated_by: string | null
          vegetacao_predominante: string | null
          velocidade_crescimento: string | null
        }
        Insert: {
          altura?: string | null
          arvores?: string | null
          cobertura?: string | null
          created_at?: string
          created_by?: string | null
          densidade?: string | null
          especie?: string | null
          id?: string
          invasoras?: string | null
          levantamento_id: string
          observacoes?: string | null
          tipo?: string | null
          uniformidade?: string | null
          updated_at?: string
          updated_by?: string | null
          vegetacao_predominante?: string | null
          velocidade_crescimento?: string | null
        }
        Update: {
          altura?: string | null
          arvores?: string | null
          cobertura?: string | null
          created_at?: string
          created_by?: string | null
          densidade?: string | null
          especie?: string | null
          id?: string
          invasoras?: string | null
          levantamento_id?: string
          observacoes?: string | null
          tipo?: string | null
          uniformidade?: string | null
          updated_at?: string
          updated_by?: string | null
          vegetacao_predominante?: string | null
          velocidade_crescimento?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'vegetacao_created_by_fkey'
            columns: ['created_by']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'vegetacao_levantamento_id_fkey'
            columns: ['levantamento_id']
            isOneToOne: true
            referencedRelation: 'levantamentos'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'vegetacao_updated_by_fkey'
            columns: ['updated_by']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: { Args: never; Returns: boolean }
      is_inspetor_do_avm: { Args: { p_avm_id: string }; Returns: boolean }
      user_perfil: {
        Args: never
        Returns: Database['public']['Enums']['perfil_usuario']
      }
    }
    Enums: {
      avm_classe_funcional: 'A' | 'B' | 'C' | 'D'
      evidencia_tipo:
        | 'VISTA_GERAL'
        | 'VEGETACAO_PREDOMINANTE'
        | 'ACESSO'
        | 'INFRAESTRUTURA_INTERFERENCIA'
        | 'SEGURANCA'
        | 'AMBIENTAL'
        | 'OCORRENCIA'
        | 'DRENAGEM'
        | 'EQUIPAMENTO'
        | 'CONDICAO_CRITICA'
        | 'OUTRO'
      ocorrencia_criticidade: 'BAIXA' | 'MEDIA' | 'ALTA' | 'CRITICA'
      ocorrencia_status: 'ABERTA' | 'EM_ANALISE' | 'RESOLVIDA' | 'NAO_APLICAVEL'
      ocorrencia_tipo:
        | 'VEGETACAO'
        | 'LIMPEZA'
        | 'SEGURANCA'
        | 'INFRAESTRUTURA'
        | 'AMBIENTAL'
        | 'ACESSO'
        | 'INTERFERENCIA'
        | 'EQUIPAMENTO'
        | 'OUTRO'
      perfil_usuario: 'ADMINISTRADOR' | 'INSPETOR_SAPORE' | 'FISCAL_VALE'
      status_ciclo:
        | 'NAO_INICIADA'
        | 'EM_ANDAMENTO'
        | 'ENVIADA_VALIDACAO'
        | 'REPROVADA'
        | 'APROVADA'
        | 'NECESSITA_COMPLEMENTACAO'
      validacao_acao: 'APROVADO' | 'REPROVADO' | 'SOLICITADA_COMPLEMENTACAO'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] &
        DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] &
        DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema['Tables'] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema['Tables'] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    keyof DefaultSchema['Enums'] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      avm_classe_funcional: ['A', 'B', 'C', 'D'],
      evidencia_tipo: [
        'VISTA_GERAL',
        'VEGETACAO_PREDOMINANTE',
        'ACESSO',
        'INFRAESTRUTURA_INTERFERENCIA',
        'SEGURANCA',
        'AMBIENTAL',
        'OCORRENCIA',
        'DRENAGEM',
        'EQUIPAMENTO',
        'CONDICAO_CRITICA',
        'OUTRO',
      ],
      ocorrencia_criticidade: ['BAIXA', 'MEDIA', 'ALTA', 'CRITICA'],
      ocorrencia_status: ['ABERTA', 'EM_ANALISE', 'RESOLVIDA', 'NAO_APLICAVEL'],
      ocorrencia_tipo: [
        'VEGETACAO',
        'LIMPEZA',
        'SEGURANCA',
        'INFRAESTRUTURA',
        'AMBIENTAL',
        'ACESSO',
        'INTERFERENCIA',
        'EQUIPAMENTO',
        'OUTRO',
      ],
      perfil_usuario: ['ADMINISTRADOR', 'INSPETOR_SAPORE', 'FISCAL_VALE'],
      status_ciclo: [
        'NAO_INICIADA',
        'EM_ANDAMENTO',
        'ENVIADA_VALIDACAO',
        'REPROVADA',
        'APROVADA',
        'NECESSITA_COMPLEMENTACAO',
      ],
      validacao_acao: ['APROVADO', 'REPROVADO', 'SOLICITADA_COMPLEMENTACAO'],
    },
  },
} as const

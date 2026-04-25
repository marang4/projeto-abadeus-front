import React, { useState, useEffect, useCallback } from 'react';
import { Container, Card, Alert, Form, Button, Spinner } from 'react-bootstrap';
import { Plus, PencilSquare, Tags, ExclamationTriangleFill } from 'react-bootstrap-icons';
import { useAuth } from '../../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Table from '../../../components/table';
import Modal from '../../../components/Modal';
import { CategoriaEventoService, type CategoriaEventoResponseDTO } from '../../../services/categoriaEventoService';

interface FormState {
  nome: string;
}

const FORM_INICIAL: FormState = { nome: '' };

function CategoriaEventoAdminPage() {
  const { usuario } = useAuth();
  const navigate = useNavigate();
  const isAdmin = usuario?.role === 'ROLE_ADMIN' || usuario?.role === 'ROLE_SUPER_ADMIN';

  const [categorias, setCategorias] = useState<CategoriaEventoResponseDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [pageError, setPageError] = useState<string | null>(null);
  const [modalError, setModalError] = useState<string | null>(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<CategoriaEventoResponseDTO | null>(null);
  const [formData, setFormData] = useState<FormState>(FORM_INICIAL);

  const loadDados = useCallback(async () => {
    setLoading(true);
    setPageError(null);
    try {
      const data = await CategoriaEventoService.listarTodos();
      setCategorias(data);
    } catch {
      setPageError('Erro ao carregar as categorias.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isAdmin) { navigate('/'); return; }
    loadDados();
  }, [isAdmin, loadDados, navigate]);

  const handleOpenCreate = () => {
    setCategoriaSelecionada(null);
    setFormData(FORM_INICIAL);
    setModalError(null);
    setShowFormModal(true);
  };

  const handleOpenEdit = (categoria: CategoriaEventoResponseDTO) => {
    setCategoriaSelecionada(categoria);
    setFormData({ nome: categoria.nome });
    setModalError(null);
    setShowFormModal(true);
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setModalError(null);
    try {
      const payload = { nome: formData.nome };
      if (categoriaSelecionada) {
        await CategoriaEventoService.atualizarCategoria(categoriaSelecionada.id, payload);
      } else {
        await CategoriaEventoService.criarCategoria(payload);
      }
      await loadDados();
      setShowFormModal(false);
    } catch (err: any) {
      setModalError(err.response?.data?.mensagem || err.message || 'Erro ao processar a requisição.');
    } finally {
      setSaving(false);
    }
  };

  const field = (key: keyof FormState) => ({
    value: formData[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
      setFormData((prev) => ({ ...prev, [key]: e.target.value })),
  });

  const columns = [
    { key: 'id', header: 'ID', width: '10%', align: 'center' },
    { key: 'nome', header: 'Nome da Categoria', width: '75%', sortable: true },
    {
      key: 'acoes', header: 'Ações', width: '15%', align: 'center',
      render: (item: CategoriaEventoResponseDTO) => (
        <Button
          variant="outline-primary" size="sm"
          onClick={(e) => { e.stopPropagation(); handleOpenEdit(item); }}
        >
          <PencilSquare /> Editar
        </Button>
      ),
    },
  ];

  if (!isAdmin) return null;

  return (
    <Container fluid className="py-4 module-page">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3 page-header">
        <h4 className="mb-0 fw-bold d-flex align-items-center" style={{ color: 'var(--senac-azul)' }}>
          <Tags className="me-2" /> Gestão de Categorias de Eventos
        </h4>
        <Button variant="secondary" className="fw-bold px-4 shadow-sm" onClick={handleOpenCreate}>
          <Plus size={22} className="me-1" /> Nova Categoria
        </Button>
      </div>

      {pageError && (
        <Alert variant="danger" dismissible onClose={() => setPageError(null)}>
          {pageError}
        </Alert>
      )}

      <Card className="border-0 shadow-sm rounded-4">
        <Card.Body className="p-0 position-relative">
          {loading && (
            <div className="position-absolute top-50 start-50 translate-middle" style={{ zIndex: 10 }}>
              <Spinner animation="border" variant="primary" />
            </div>
          )}
          <div style={{ opacity: loading ? 0.5 : 1 }}>
            <Table<CategoriaEventoResponseDTO>
              data={categorias}
              columns={columns}
              isLoading={loading}
              emptyMessage="Nenhuma categoria registrada no sistema."
              showPagination
            />
          </div>
        </Card.Body>
      </Card>

      <Modal
        show={showFormModal}
        onHide={() => setShowFormModal(false)}
        title={categoriaSelecionada ? 'Editar Categoria' : 'Nova Categoria'}
        size="md"
        footer={
          <div className="d-flex gap-2">
            <Button variant="secondary" onClick={() => setShowFormModal(false)} disabled={saving}>
              Cancelar
            </Button>
            <Button
              className="border-0"
              style={{ backgroundColor: 'var(--senac-azul)' }}
              onClick={handleSubmitForm}
              disabled={saving}
            >
              {saving
                ? <Spinner size="sm" animation="border" />
                : categoriaSelecionada ? 'Salvar Alterações' : 'Criar Categoria'}
            </Button>
          </div>
        }
      >
        <Form className="p-2" onSubmit={handleSubmitForm}>
          {modalError && (
            <Alert variant="danger" className="d-flex align-items-center small py-2 mb-3 border-0">
              <ExclamationTriangleFill className="me-2" /> {modalError}
            </Alert>
          )}
          <Form.Group>
            <Form.Label className="fw-semibold small text-muted">NOME DA CATEGORIA</Form.Label>
            <Form.Control type="text" {...field('nome')} required />
          </Form.Group>
        </Form>
      </Modal>
    </Container>
  );
}

export default CategoriaEventoAdminPage;
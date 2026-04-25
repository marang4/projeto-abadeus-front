import React, { useState, useEffect, useCallback } from 'react';
import { Container, Card, Alert, Form, Button, Row, Col, Badge, Spinner } from 'react-bootstrap';
import { Plus, Image, PencilSquare, CalendarEvent, ExclamationTriangleFill, Trash3 } from 'react-bootstrap-icons';
import { useAuth } from '../../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { EventoService, type EventoResponseDTO, type CategoriaResponseDTO } from '../../../services/eventoService';
import Table, { type Column } from '../../../components/table';
import Modal from '../../../components/Modal';

const formatBackendToInput = (value: string | undefined): string => {
  if (!value) return '';
  if (value.includes('T')) return value.substring(0, 16);
  return value;
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

const formatDateDisplay = (value: string) => {
  if (!value) return '-';
  return new Date(value).toLocaleString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
};

interface FormState {
  nome: string;
  descricao: string;
  quantidadeOcupacao: string;
  dataHoraInicio: string;
  dataHoraFim: string;
  valor: string;
  categoriaId: string;
}

const FORM_INICIAL: FormState = {
  nome: '',
  descricao: '',
  quantidadeOcupacao: '',
  dataHoraInicio: '',
  dataHoraFim: '',
  valor: '',
  categoriaId: '',
};

function EventoAdminPage() {
  const { usuario } = useAuth();
  const navigate = useNavigate();
  const isAdmin = usuario?.role === 'ROLE_ADMIN' || usuario?.role === 'ROLE_SUPER_ADMIN';

  const [eventos, setEventos] = useState<EventoResponseDTO[]>([]);
  const [categorias, setCategorias] = useState<CategoriaResponseDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [pageError, setPageError] = useState<string | null>(null);
  const [modalError, setModalError] = useState<string | null>(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [eventoSelecionado, setEventoSelecionado] = useState<EventoResponseDTO | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormState>(FORM_INICIAL);

  const loadDados = useCallback(async () => {
    setLoading(true);
    setPageError(null);
    try {
      const [evtData, catData] = await Promise.all([
        EventoService.listarTodos(),
        EventoService.listarCategorias(),
      ]);
      setEventos(evtData);
      setCategorias(catData);
    } catch {
      setPageError('Erro ao carregar os dados dos eventos.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isAdmin) { navigate('/'); return; }
    loadDados();
  }, [isAdmin, loadDados, navigate]);

  const handleOpenCreate = () => {
    setEventoSelecionado(null);
    setFormData(FORM_INICIAL);
    setModalError(null);
    setShowFormModal(true);
  };

  const handleOpenEdit = (evento: EventoResponseDTO) => {
    setEventoSelecionado(evento);
    setFormData({
      nome: evento.nome,
      descricao: evento.descricao,
      quantidadeOcupacao: evento.quantidadeOcupacao.toString(),
      dataHoraInicio: formatBackendToInput(evento.dataHoraInicio),
      dataHoraFim: formatBackendToInput(evento.dataHoraFim),
      valor: (evento.valor / 100).toString(),
      categoriaId: evento.categoriaId.toString(),
    });
    setModalError(null);
    setShowFormModal(true);
  };

  const handleOpenImageManager = (evento: EventoResponseDTO) => {
    setEventoSelecionado(evento);
    setSelectedFile(null);
    setPreviewUrl(null);
    setModalError(null);
    setShowImageModal(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setSelectedFile(file);
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleCloseImageModal = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setShowImageModal(false);
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.dataHoraFim && formData.dataHoraInicio && formData.dataHoraFim <= formData.dataHoraInicio) {
      setModalError('A data de término deve ser posterior à data de início.');
      return;
    }
    
    setSaving(true);
    setModalError(null);

    try {
      // infere dinamicamente o tipo de payload baseado no service
      type CriarEventoPayload = Parameters<typeof EventoService.criarEvento>[0];
      
      const payload: CriarEventoPayload = {
        nome: formData.nome,
        descricao: formData.descricao,
        quantidadeOcupacao: Number(formData.quantidadeOcupacao),
        dataHoraInicio: formData.dataHoraInicio,
        dataHoraFim: formData.dataHoraFim,
        valor: Math.round(Number(formData.valor) * 100),
        categoriaId: Number(formData.categoriaId) || undefined,
      } as CriarEventoPayload;

      if (eventoSelecionado) {
        await EventoService.atualizarEvento(eventoSelecionado.id, payload as any);
      } else {
        await EventoService.criarEvento(payload);
      }
      
      await loadDados();
      setShowFormModal(false);
    } catch (err: any) {
      setModalError(err.response?.data?.mensagem || err.message || 'Erro ao processar a requisição.');
    } finally {
      setSaving(false);
    }
  };

  const handleUploadImagem = async () => {
    if (!eventoSelecionado || !selectedFile) return;
    setSaving(true);
    setModalError(null);
    try {
      await EventoService.atualizarImagem(eventoSelecionado.id, selectedFile);
      await loadDados();
      handleCloseImageModal();
    } catch (err: any) {
      setModalError(err.response?.data?.mensagem || err.message || 'Erro ao salvar a imagem.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeletarImagem = async () => {
    if (!eventoSelecionado) return;
    if (!window.confirm('Tem certeza que deseja remover a capa deste evento?')) return;
    setSaving(true);
    setModalError(null);
    try {
      await EventoService.deletarImagem(eventoSelecionado.id);
      await loadDados();
      handleCloseImageModal();
    } catch (err: any) {
      setModalError(err.response?.data?.mensagem || err.message || 'Erro ao remover a imagem.');
    } finally {
      setSaving(false);
    }
  };

  const field = (key: keyof FormState) => ({
    value: formData[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setFormData((prev) => ({ ...prev, [key]: e.target.value })),
  });

  // tipagem explicita resolve o erro do ts no <Table>
  const columns: Column<EventoResponseDTO>[] = [
    { key: 'id', header: '#', width: '5%', align: 'center' },
    { key: 'nome', header: 'Nome do Evento', width: '20%' },
    {
      key: 'categoriaNome', header: 'Categoria', width: '12%', align: 'center',
      render: (item) => <Badge bg="secondary">{item.categoriaNome}</Badge>,
    },
    {
      key: 'dataHoraInicio', header: 'Início', width: '14%', align: 'center',
      render: (item) => formatDateDisplay(item.dataHoraInicio),
    },
    {
      key: 'dataHoraFim', header: 'Término', width: '14%', align: 'center',
      render: (item) => formatDateDisplay(item.dataHoraFim),
    },
    { key: 'quantidadeOcupacao', header: 'Vagas', width: '8%', align: 'center' },
    {
      key: 'valor', header: 'Valor', width: '10%', align: 'center',
      render: (item) => formatCurrency(item.valor / 100),
    },
    {
      key: 'acoes', header: 'Ações', width: '17%', align: 'center',
      render: (item) => (
        <div className="d-flex gap-2 justify-content-center">
          <Button
            variant="outline-primary" size="sm"
            onClick={(e) => { e.stopPropagation(); handleOpenEdit(item); }}
          >
            <PencilSquare /> Editar
          </Button>
          <Button
            variant={item.urlImagemEvento ? 'outline-success' : 'outline-secondary'} size="sm"
            onClick={(e) => { e.stopPropagation(); handleOpenImageManager(item); }}
          >
            <Image /> Capa
          </Button>
        </div>
      ),
    },
  ];

  if (!isAdmin) return null;

  return (
    <Container fluid className="py-4 module-page">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3 page-header">
        <h4 className="mb-0 fw-bold d-flex align-items-center" style={{ color: '#1453bd' }}>
          <CalendarEvent className="me-2" /> Gestão de Eventos
        </h4>
        <Button variant="secondary" className="fw-bold px-4 shadow-sm" onClick={handleOpenCreate}>
          <Plus size={22} className="me-1" /> Novo Evento
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
            <Table<EventoResponseDTO>
              data={eventos}
              columns={columns}
              isLoading={loading}
              emptyMessage="Nenhum evento registrado no sistema."
              totalPages={1}
            />
          </div>
        </Card.Body>
      </Card>

      <Modal
        show={showFormModal}
        onHide={() => setShowFormModal(false)}
        title={eventoSelecionado ? 'Editar Evento' : 'Criar Novo Evento'}
        size="lg"
        footer={
          <div className="d-flex gap-2">
            <Button variant="secondary" onClick={() => setShowFormModal(false)} disabled={saving}>
              Cancelar
            </Button>
            <Button
              className="border-0"
              style={{ backgroundColor: '#1453bd' }}
              onClick={handleSubmitForm}
              disabled={saving}
            >
              {saving
                ? <Spinner size="sm" animation="border" />
                : eventoSelecionado ? 'Salvar Alterações' : 'Criar Evento'}
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
          <Row className="g-3 mb-3">
            <Col md={8}>
              <Form.Group>
                <Form.Label className="fw-semibold small text-muted">NOME DO EVENTO</Form.Label>
                <Form.Control type="text" {...field('nome')} required />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label className="fw-semibold small text-muted">CATEGORIA</Form.Label>
                <Form.Select {...field('categoriaId')} required>
                  <option value="">Selecione...</option>
                  {categorias.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.nome}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold small text-muted">DESCRIÇÃO COMPLETA</Form.Label>
            <Form.Control as="textarea" rows={3} {...field('descricao')} required />
          </Form.Group>
          <Row className="g-3 mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label className="fw-semibold small text-muted">DATA E HORA DE INÍCIO</Form.Label>
                <Form.Control type="datetime-local" {...field('dataHoraInicio')} required />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label className="fw-semibold small text-muted">DATA E HORA DE TÉRMINO</Form.Label>
                <Form.Control
                  type="datetime-local"
                  {...field('dataHoraFim')}
                  min={formData.dataHoraInicio}
                  required
                />
              </Form.Group>
            </Col>
          </Row>
          <Row className="g-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label className="fw-semibold small text-muted">CAPACIDADE (VAGAS)</Form.Label>
                <Form.Control type="number" min="1" {...field('quantidadeOcupacao')} required />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label className="fw-semibold small text-muted">VALOR (R$)</Form.Label>
                <Form.Control type="number" step="0.01" min="0" {...field('valor')} required />
              </Form.Group>
            </Col>
          </Row>
        </Form>
      </Modal>

      <Modal
        show={showImageModal}
        onHide={handleCloseImageModal}
        title="Capa do Evento"
        size="md"
        footer={
          <div className="d-flex gap-2">
            <Button variant="secondary" onClick={handleCloseImageModal} disabled={saving}>
              Fechar
            </Button>
            {eventoSelecionado?.urlImagemEvento && !selectedFile && (
              <Button variant="danger" onClick={handleDeletarImagem} disabled={saving}>
                {saving ? <Spinner size="sm" animation="border" /> : <><Trash3 className="me-1" /> Remover Capa</>}
              </Button>
            )}
            {selectedFile && (
              <Button
                className="border-0"
                style={{ backgroundColor: '#1453bd' }}
                onClick={handleUploadImagem}
                disabled={saving}
              >
                {saving ? <Spinner size="sm" animation="border" /> : 'Confirmar Upload'}
              </Button>
            )}
          </div>
        }
      >
        <div className="p-2">
          <p className="fw-bold text-muted small text-center mb-3">{eventoSelecionado?.nome}</p>
          {previewUrl ? (
            <div className="text-center mb-3">
              <p className="small text-muted mb-2">Pré-visualização</p>
              <img src={previewUrl} alt="Preview" className="img-fluid rounded shadow-sm"
                style={{ maxHeight: '220px', objectFit: 'cover', width: '100%' }} />
            </div>
          ) : eventoSelecionado?.urlImagemEvento ? (
            <div className="text-center mb-3">
              <p className="small text-muted mb-2">Capa atual</p>
              <img src={eventoSelecionado.urlImagemEvento} alt="Capa atual" className="img-fluid rounded shadow-sm"
                style={{ maxHeight: '220px', objectFit: 'cover', width: '100%' }} />
            </div>
          ) : (
            <div className="d-flex flex-column align-items-center justify-content-center rounded mb-3 text-muted"
              style={{ height: '160px', background: '#f8f9fa', border: '2px dashed #dee2e6' }}>
              <Image size={40} className="mb-2 opacity-50" />
              <span className="small">Nenhuma capa configurada</span>
            </div>
          )}
          {modalError && (
            <Alert variant="danger" className="d-flex align-items-center small py-2 mb-3 border-0">
              <ExclamationTriangleFill className="me-2" /> {modalError}
            </Alert>
          )}
          <div className="border-top pt-3">
            <Form.Label className="fw-semibold small text-muted">
              {eventoSelecionado?.urlImagemEvento ? 'Substituir imagem' : 'Selecionar imagem'} (PNG, JPG)
            </Form.Label>
            <Form.Control type="file" accept="image/png, image/jpeg" onChange={handleFileChange} />
          </div>
        </div>
      </Modal>
    </Container>
  );
}

export default EventoAdminPage;
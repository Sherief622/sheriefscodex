import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  fetchProjectById,
  saveProject,
  createEmptyProject,
  createContentBlock,
  generateSlug,
  uploadImage,
} from '../../data/projectStore';
import ContentRenderer from '../../components/ContentRenderer';
import type { Project, ContentBlock } from '../../data/types';
export default function ProjectEditorPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project>(createEmptyProject());
  const [tagInput, setTagInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [loading, setLoading] = useState(!!id);
  //Load existing project if editing
  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    (async () => {
      const p = await fetchProjectById(id);
      if (!cancelled && p) {
        setProject(p);
      }
      if (!cancelled) setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  //Tag management
  const addTag = () => {
    const tag = tagInput.trim();
    if (tag && !project.tags.includes(tag)) {
      setProject({ ...project, tags: [...project.tags, tag] });
    }
    setTagInput('');
  };

  const removeTag = (tag: string) => {
    setProject({ ...project, tags: project.tags.filter((t) => t !== tag) });
  };

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    }
    if (e.key === 'Backspace' && !tagInput && project.tags.length > 0) {
      removeTag(project.tags[project.tags.length - 1]);
    }
  };
  //Content block management
  const addBlock = (type: ContentBlock['type']) => {
    setProject({
      ...project,
      contentBlocks: [...project.contentBlocks, createContentBlock(type)],
    });
  };
  const updateBlock = useCallback(
    (index: number, updates: Partial<ContentBlock>) => {
      setProject((prev) => {
        const blocks = [...prev.contentBlocks];
        blocks[index] = { ...blocks[index], ...updates } as ContentBlock;
        return { ...prev, contentBlocks: blocks };
      });
    },
    []
  );
  const removeBlock = (index: number) => {
    setProject({
      ...project,
      contentBlocks: project.contentBlocks.filter((_, i) => i !== index),
    });
  };
  const moveBlock = (index: number, direction: 'up' | 'down') => {
    const blocks = [...project.contentBlocks];
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= blocks.length) return;
    [blocks[index], blocks[target]] = [blocks[target], blocks[index]];
    setProject({ ...project, contentBlocks: blocks });
  };
  //Thumbnail upload
  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await uploadImage(file);
      setProject((prev) => ({ ...prev, thumbnail: url }));
    } catch (err) {
      console.error('Thumbnail upload failed:', err);
    }
  };
  //Image block upload
  const handleImageUpload = async (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await uploadImage(file);
      updateBlock(index, { src: url });
    } catch (err) {
      console.error('Image upload failed:', err);
    }
  };
  //Save
  const handleSave = async () => {
    setSaving(true);
    const slug = project.slug || generateSlug(project.title);
    const toSave = { ...project, slug };
    await saveProject(toSave);
    setSaving(false);
    navigate('/admin');
  };
  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="container">
          <p style={{ color: 'var(--text-secondary)', padding: 'var(--space-20) 0' }}>
            Loading project…
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="admin-dashboard">
      <div className="container">
        <div className="admin-dashboard__header animate-fade-in-up">
          <Link to="/admin" className="project-detail__back">
            ← Back to Dashboard
          </Link>
          <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
            <button
              className="btn btn--secondary"
              onClick={() => setShowPreview(!showPreview)}
            >
              {showPreview ? 'Edit' : 'Preview'}
            </button>
            <button
              className="btn btn--primary"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? 'Saving…' : 'Save Project'}
            </button>
          </div>
        </div>

        {showPreview ? (
          /* ── Preview Mode ── */
          <div className="animate-fade-in-up">
            <header className="project-detail__header">
              <h1 className="project-detail__title">
                {project.title || 'Untitled Project'}
              </h1>
              <p className="project-detail__description">
                {project.description}
              </p>
              <div className="project-detail__tags">
                {project.tags.map((tag) => (
                  <span key={tag} className="tag">
                    {tag}
                  </span>
                ))}
              </div>
            </header>
            <ContentRenderer blocks={project.contentBlocks} />
          </div>
        ) : (
          /*Edit Mode */
          <div className="animate-fade-in-up stagger-1">
            {/*Project metadata*/}
            <div className="editor-section">
              <h2 className="editor-section__title">Project Details</h2>

              <div className="form-group">
                <label className="form-label">Title</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="My Awesome Project"
                  value={project.title}
                  onChange={(e) =>
                    setProject({ ...project, title: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  Slug{' '}
                  <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>
                    (auto-generated if empty)
                  </span>
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder={generateSlug(project.title) || 'my-awesome-project'}
                  value={project.slug}
                  onChange={(e) =>
                    setProject({ ...project, slug: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-input form-textarea"
                  placeholder="A brief description of the project..."
                  rows={3}
                  value={project.description}
                  onChange={(e) =>
                    setProject({ ...project, description: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label className="form-label">Tags</label>
                <div className="tag-input-wrapper">
                  {project.tags.map((tag) => (
                    <span key={tag} className="tag tag--removable">
                      {tag}
                      <button
                        className="tag__remove"
                        onClick={() => removeTag(tag)}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  <input
                    type="text"
                    className="tag-input"
                    placeholder="Add tag…"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleTagKeyDown}
                    onBlur={addTag}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Thumbnail</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailUpload}
                  className="form-input"
                />
                {project.thumbnail && (
                  <div style={{ marginTop: 'var(--space-2)' }}>
                    <img
                      src={project.thumbnail}
                      alt="Thumbnail preview"
                      style={{
                        maxWidth: 200,
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-subtle)',
                      }}
                    />
                    <button
                      className="btn btn--danger btn--small"
                      style={{ marginLeft: 'var(--space-2)' }}
                      onClick={() => setProject({ ...project, thumbnail: '' })}
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label
                  className="form-label"
                  style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}
                >
                  <input
                    type="checkbox"
                    checked={project.featured}
                    onChange={(e) =>
                      setProject({ ...project, featured: e.target.checked })
                    }
                    style={{ width: 18, height: 18 }}
                  />
                  Featured project
                </label>
              </div>
            </div>

            {/*Content blocks*/}
            <div className="editor-section">
              <h2 className="editor-section__title">Content Blocks</h2>

              {project.contentBlocks.length === 0 && (
                <p
                  style={{
                    color: 'var(--text-muted)',
                    fontSize: 'var(--text-sm)',
                    marginBottom: 'var(--space-4)',
                  }}
                >
                  No content blocks yet. Add one below.
                </p>
              )}

              {project.contentBlocks.map((block, index) => (
                <div key={block.id} className="editor-block">
                  <div className="editor-block__header">
                    <span className="editor-block__type">
                      {block.type.toUpperCase()}
                    </span>
                    <div className="editor-block__controls">
                      <button
                        className="btn btn--icon btn--secondary"
                        onClick={() => moveBlock(index, 'up')}
                        disabled={index === 0}
                        title="Move up"
                      >
                        ↑
                      </button>
                      <button
                        className="btn btn--icon btn--secondary"
                        onClick={() => moveBlock(index, 'down')}
                        disabled={index === project.contentBlocks.length - 1}
                        title="Move down"
                      >
                        ↓
                      </button>
                      <button
                        className="btn btn--icon btn--danger"
                        onClick={() => removeBlock(index)}
                        title="Remove block"
                      >
                        ×
                      </button>
                    </div>
                  </div>

                  {/*Block specific editors*/}
                  {block.type === 'heading' && (
                    <div className="editor-block__body">
                      <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                        <select
                          className="form-input"
                          style={{ width: 80 }}
                          value={block.level}
                          onChange={(e) =>
                            updateBlock(index, {
                              level: Number(e.target.value) as 2 | 3,
                            })
                          }
                        >
                          <option value={2}>H2</option>
                          <option value={3}>H3</option>
                        </select>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="Heading text…"
                          value={block.text}
                          onChange={(e) =>
                            updateBlock(index, { text: e.target.value })
                          }
                        />
                      </div>
                    </div>
                  )}

                  {block.type === 'text' && (
                    <div className="editor-block__body">
                      <textarea
                        className="form-input form-textarea"
                        placeholder="Write your text here… (supports **bold**, *italic*, - lists, etc.)"
                        rows={5}
                        value={block.body}
                        onChange={(e) =>
                          updateBlock(index, { body: e.target.value })
                        }
                      />
                    </div>
                  )}

                  {block.type === 'code' && (
                    <div className="editor-block__body">
                      <div
                        style={{
                          display: 'flex',
                          gap: 'var(--space-3)',
                          marginBottom: 'var(--space-3)',
                        }}
                      >
                        <select
                          className="form-input"
                          style={{ width: 160 }}
                          value={block.language}
                          onChange={(e) =>
                            updateBlock(index, { language: e.target.value })
                          }
                        >
                          <option value="python">Python</option>
                          <option value="typescript">TypeScript</option>
                          <option value="javascript">JavaScript</option>
                          <option value="java">Java</option>
                          <option value="cpp">C++</option>
                          <option value="c">C</option>
                          <option value="csharp">C#</option>
                          <option value="go">Go</option>
                          <option value="rust">Rust</option>
                          <option value="sql">SQL</option>
                          <option value="bash">Bash</option>
                          <option value="yaml">YAML</option>
                          <option value="json">JSON</option>
                          <option value="html">HTML</option>
                          <option value="css">CSS</option>
                          <option value="dockerfile">Dockerfile</option>
                          <option value="lua">Lua</option>
                        </select>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="Caption (optional)"
                          value={block.caption || ''}
                          onChange={(e) =>
                            updateBlock(index, { caption: e.target.value })
                          }
                        />
                      </div>
                      <div className="code-editor-wrapper">
                        <div
                          className="code-editor-lines"
                          aria-hidden="true"
                        >
                          {(block.code || '\n').split('\n').map((_, i) => (
                            <span key={i}>{i + 1}</span>
                          ))}
                        </div>
                        <textarea
                          className="form-input form-textarea form-textarea--code code-editor-textarea"
                          placeholder="Paste your code here…"
                          rows={10}
                          value={block.code}
                          onChange={(e) =>
                            updateBlock(index, { code: e.target.value })
                          }
                        />
                      </div>
                    </div>
                  )}

                  {block.type === 'image' && (
                    <div className="editor-block__body">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(index, e)}
                        className="form-input"
                      />
                      {block.src && (
                        <img
                          src={block.src}
                          alt={block.alt || ''}
                          style={{
                            maxWidth: '100%',
                            maxHeight: 200,
                            marginTop: 'var(--space-2)',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid var(--border-subtle)',
                          }}
                        />
                      )}
                      <div
                        style={{
                          display: 'flex',
                          gap: 'var(--space-3)',
                          marginTop: 'var(--space-3)',
                        }}
                      >
                        <input
                          type="text"
                          className="form-input"
                          placeholder="Alt text"
                          value={block.alt || ''}
                          onChange={(e) =>
                            updateBlock(index, { alt: e.target.value })
                          }
                        />
                        <input
                          type="text"
                          className="form-input"
                          placeholder="Caption (optional)"
                          value={block.caption || ''}
                          onChange={(e) =>
                            updateBlock(index, { caption: e.target.value })
                          }
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/*Add block buttons*/}
              <div className="editor-add-blocks">
                <span
                  style={{
                    fontSize: 'var(--text-xs)',
                    color: 'var(--text-muted)',
                    marginRight: 'var(--space-2)',
                  }}
                >
                  Add block:
                </span>
                <button
                  className="btn btn--secondary btn--small"
                  onClick={() => addBlock('heading')}
                >
                  + Heading
                </button>
                <button
                  className="btn btn--secondary btn--small"
                  onClick={() => addBlock('text')}
                >
                  + Text
                </button>
                <button
                  className="btn btn--secondary btn--small"
                  onClick={() => addBlock('code')}
                >
                  + Code
                </button>
                <button
                  className="btn btn--secondary btn--small"
                  onClick={() => addBlock('image')}
                >
                  + Image
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

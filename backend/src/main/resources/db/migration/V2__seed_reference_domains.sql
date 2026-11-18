-- Reference taxonomy only (no people, no projects, no stats). Admins can edit via the API later.
INSERT INTO domains (slug, name, description) VALUES
 ('web-development',   'Web Development',   'Frontend, backend and full-stack web engineering'),
 ('ai-ml',             'AI & Machine Learning', 'Machine learning, deep learning and applied AI'),
 ('data-science',      'Data Science',      'Analytics, statistics and data engineering'),
 ('cybersecurity',     'Cybersecurity',     'Application, network and cloud security'),
 ('cloud-devops',      'Cloud & DevOps',    'Cloud platforms, CI/CD and infrastructure'),
 ('mobile-development','Mobile Development','Android, iOS and cross-platform apps'),
 ('ui-ux-design',      'UI/UX Design',      'Product design, research and prototyping'),
 ('product-management','Product Management','Product strategy, roadmapping and delivery');

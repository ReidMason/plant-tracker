package plantstore

type Plant struct {
	name   string
	id     int
	userId int
}

func (p *Plant) GetId() int {
	return p.id
}

func (p *Plant) GetUserId() int {
	return p.userId
}

func (p *Plant) GetName() string {
	return p.name
}

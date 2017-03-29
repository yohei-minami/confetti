const sqrt = Math.sqrt;

class Vector2 {
  constructor(_x, _y) {
    this.x = _x;
    this.y = _y;
  }
  Length() {
    return sqrt(this.SqrLength());
  }
  SqrLength() {
    return (this.x * this.x) + (this.y * this.y);
  }
  Add(_vec) {
    this.x += _vec.x;
    this.y += _vec.y;
  }
  Sub(_vec) {
    this.x -= _vec.x;
    this.y -= _vec.y;
  }
  Div(_f) {
    this.x /= _f;
    this.y /= _f;
  }
  Mul(_f) {
    this.x *= _f;
    this.y *= _f;
  }
  Normalize() {
    const sqrLen = this.SqrLength();
    if (sqrLen !== 0) {
      const factor = 1.0 / sqrt(sqrLen);
      this.x *= factor;
      this.y *= factor;
    }
  }
  Normalized() {
    const sqrLen = this.SqrLength();
    if (sqrLen !== 0) {
      const factor = 1.0 / sqrt(sqrLen);
      return new Vector2(this.x * factor, this.y * factor);
    }
    return new Vector2(0, 0);
  }
}

Vector2.Lerp = function Lerp(_vec0, _vec1, _t) {
  return new Vector2(((_vec1.x - _vec0.x) * _t) + _vec0.x, ((_vec1.y - _vec0.y) * _t) + _vec0.y);
};

Vector2.Distance = function Distance(_vec0, _vec1) {
  return sqrt(Vector2.SqrDistance(_vec0, _vec1));
};

Vector2.SqrDistance = function SqrDistance(_vec0, _vec1) {
  const x = _vec0.x - _vec1.x;
  const y = _vec0.y - _vec1.y;
  return (x * x) + (y * y);
};

Vector2.Scale = function Scale(_vec0, _vec1) {
  return new Vector2(_vec0.x * _vec1.x, _vec0.y * _vec1.y);
};

Vector2.Min = function Min(_vec0, _vec1) {
  return new Vector2(Math.min(_vec0.x, _vec1.x), Math.min(_vec0.y, _vec1.y));
};

Vector2.Max = function Max(_vec0, _vec1) {
  return new Vector2(Math.max(_vec0.x, _vec1.x), Math.max(_vec0.y, _vec1.y));
};

Vector2.ClampMagnitude = function ClampMagnitude(_vec0, _len) {
  const vecNorm = _vec0.Normalized;
  return new Vector2(vecNorm.x * _len, vecNorm.y * _len);
};

Vector2.Sub = function Sub(_vec0, _vec1) {
  return new Vector2(_vec0.x - _vec1.x, _vec0.y - _vec1.y, _vec0.z - _vec1.z);
};

module.exports = Vector2;

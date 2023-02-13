#include "complexpoint.h"
#include <cmath>
using namespace std;

ComplexPoint::ComplexPoint(double re, double im)
{
    this->re = re;
    this->im = im;
    this->itr = 0;
};

ComplexPoint ComplexPoint::operator+(const ComplexPoint& b)
{
    return ComplexPoint(re + b.re, im + b.im);
}

ComplexPoint ComplexPoint::operator-(const ComplexPoint& b)
{
    return ComplexPoint(re - b.re, im - b.im);
}

ComplexPoint ComplexPoint::operator*(const ComplexPoint& b)
{
    return ComplexPoint(re * b.re - im * b.im, re * b.im + im * b.re);
}

double ComplexPoint::absPow2() {
    return re * re + im * im;
}

double ComplexPoint::abs() {
    return sqrt(absPow2());
}
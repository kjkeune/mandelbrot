#include "renderer.h"
#include <vector>
#include <thread>
#include <iostream>
#include <cmath>

using namespace cimg_library;
using namespace std;

Renderer::Renderer(int w, int h, double re, double im, float z, int itr, int color)
{
    width = w;
    height = h;
    reCenter = re;
    imCenter = im;
    zoom = z;
    maxItr = itr;
    colorFunc = color;
    init();
}

void Renderer::init() {
    image = CImg<float>(width, height, 1, 3);
    if (maxItr == DYNAMIC_ITR) {
        dynamicItr = true;
    }
}

void Renderer::renderThread(int pid, int nThreads)
{
    for (int y = pid; y < height; y += nThreads - 1)
    {
        for (int x = 0; x < width; x++)
        {
            ComplexPoint point = convertToPoint(x, y);
            isIncluded(point, maxItr);
            setPixel(x, y, getColor(point.itr));
        }
    }
}

/**
 * @brief Rende
 * 
 */
CImg<float> Renderer::render()
{
    if (dynamicItr) {
        maxItr = 100 + (30.0f * zoom * log10(zoom + 1.0f));
    }
    int const nThreads = thread::hardware_concurrency();
    vector<thread> threads;
    for (int i = 0; i < nThreads - 1; i++)
    {
        threads.emplace_back(thread(&Renderer::renderThread, this, i, nThreads));
    }
    // renderThread(nThreads - 1, nThreads);
    for (int i = 0; i < nThreads - 1; i++)
    {
        threads[i].join();
    }
    return image.HSVtoRGB();
}
/**
 * @brief Set Pixel (x,y) to Color color
 * 
 * @param x 
 * @param y 
 * @param color 
 */
void Renderer::setPixel(int x, int y, Color color)
{
    image(x, y, 0) = color.h;
    image(x, y, 1) = color.s;
    image(x, y, 2) = color.v;
}

/**
 * @brief Calculates the color based on the number auf iterations.
 * colorFunc specifies the color Pallet.
 * 
 * @param itr 
 * @return 
 */
Color Renderer::getColor(int itr)
{
    Color color = {0, 0.0f, 0.0f};
    switch (colorFunc)
    {
    case RAINBOW:
        if (itr < maxItr)
        {
            color.h = 360 * log2((float)itr / maxItr + 1.0f);
            color.s = 1.0f;
            color.v = 1.0f;
        }
        break;

    case GREY_SCALE:
        color.v = log2((1.0f - (float)itr / maxItr) + 1.0f);
        break;

    default:
        break;
    }
    return color;
}
/**
 * @brief Converts pixel position into Point in the complexplan.
 * The width and zoom define the pixel per unit ratio.
 * 
 * @param x
 * @param y 
 * @return 
 */
ComplexPoint Renderer::convertToPoint(int x, int y)
{
    double pxPerUnit = (double)width / 4.0 * pow(2.0,(double)zoom);
    double re = (x - width / 2.0) / pxPerUnit + reCenter;
    double im = -1.0 * (y - height / 2.0) / pxPerUnit + imCenter;
    return ComplexPoint(re, im);
}
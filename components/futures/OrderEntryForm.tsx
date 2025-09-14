import { useState } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent } from "@/components/ui/card"

export default function FuturesOrderForm() {
    const [price, setPrice] = useState("110,924.3")
    const [size, setSize] = useState(0)
    const [sliderValue, setSliderValue] = useState([0])

    return (
        <Card className="w-full text-white border-none rounded-lg p-2">
            <CardContent className="p-2">
                {/* Tabs */}
                <div className="flex items-center gap-2 py-2">
                    <Button className="bg-grid text-foreground rounded-xs py-0 gap-0 px-6 text-xs h-6 hover:bg-grid/80">Cross</Button>
                    <Button className="bg-grid text-foreground rounded-xs py-0 gap-0 px-6 text-xs h-6 hover:bg-grid/80">20</Button>
                    <Button className="bg-grid text-foreground rounded-xs py-0 gap-0 px-6 text-xs h-6 hover:bg-grid/80">s</Button>
                </div>
                <Tabs defaultValue="limit" className="w-full">
                    <TabsList className="grid grid-cols-3 bg-transparent border-b border-gray-700 mb-2 rounded-none w-full">
                        <TabsTrigger value="limit" className="text-sm data-[state=active]:text-yellow-400">Limit</TabsTrigger>
                        <TabsTrigger value="market" className="text-sm data-[state=active]:text-yellow-400">Market</TabsTrigger>
                        <TabsTrigger value="stop" className="text-sm data-[state=active]:text-yellow-400">Stop Limit</TabsTrigger>
                    </TabsList>

                    {/* Limit Tab */}
                    <TabsContent value="limit" className="space-y-4">
                        <div className="text-xs text-gray-400">Avbl - USDT</div>

                        {/* Price Input */}
                        <span className="text-xs text-gray-400">Price</span>
                        <div className="flex items-center space-x-2">
                            <Input
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                className=""
                            />
                            <span className="text-sm text-gray-300">USDT</span>
                            <Button size="sm" className="bg-[#2b3139] text-gray-200">BBO</Button>
                        </div>

                        {/* Size Input */}
                        <span className="text-xs text-gray-400">Size</span>
                        <div className="flex items-center space-x-2">
                            <Input
                                type="number"
                                placeholder="Size"
                                value={size}
                                onChange={(e) => setSize(e.target.value)}
                                className="bg-[#1e2329] border-none text-white"
                            />
                            <Select defaultValue="BTC">
                                <SelectTrigger className="w-[80px] bg-[#1e2329] border-none text-white">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-[#1e2329] text-white">
                                    <SelectItem value="BTC">BTC</SelectItem>
                                    <SelectItem value="ETH">ETH</SelectItem>
                                    <SelectItem value="BNB">BNB</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Slider */}
                        <Slider
                            value={sliderValue}
                            onValueChange={setSliderValue}
                            max={100}
                            step={25}
                            className="w-full"
                        />

                        {/* Buttons */}
                        <Button className="w-full bg-yellow-400 text-black font-semibold">Register Now</Button>
                        <Button className="w-full bg-[#2b3139] text-white">Log In</Button>
                    </TabsContent>

                    {/* Market Tab */}
                    <TabsContent value="market" className="space-y-4">
                        <div className="text-xs text-gray-400">Avbl - USDT</div>

                        {/* Market doesn’t need price */}
                        <div className="flex items-center space-x-2">
                            <Input
                                type="number"
                                placeholder="Size"
                                value={size}
                                onChange={(e) => setSize(e.target.value)}
                                className="bg-[#1e2329] border-none text-white"
                            />
                            <Select defaultValue="BTC">
                                <SelectTrigger className="w-[80px] bg-[#1e2329] border-none text-white">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-[#1e2329] text-white">
                                    <SelectItem value="BTC">BTC</SelectItem>
                                    <SelectItem value="ETH">ETH</SelectItem>
                                    <SelectItem value="BNB">BNB</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <Slider
                            value={sliderValue}
                            onValueChange={setSliderValue}
                            max={100}
                            step={25}
                            className="w-full"
                        />

                        <Button className="w-full bg-yellow-400 text-black font-semibold">Register Now</Button>
                        <Button className="w-full bg-[#2b3139] text-white">Log In</Button>
                    </TabsContent>

                    {/* Stop Limit Tab */}
                    <TabsContent value="stop" className="space-y-4">
                        <div className="text-xs text-gray-400">Avbl - USDT</div>

                        {/* Stop Price */}
                        <div className="flex items-center space-x-2">
                            <Input
                                type="number"
                                placeholder="Stop Price"
                                className="bg-[#1e2329] border-none text-white"
                            />
                            <span className="text-sm text-gray-300">USDT</span>
                        </div>

                        {/* Limit Price */}
                        <div className="flex items-center space-x-2">
                            <Input
                                type="number"
                                placeholder="Limit Price"
                                className="bg-[#1e2329] border-none text-white"
                            />
                            <span className="text-sm text-gray-300">USDT</span>
                        </div>

                        {/* Size */}
                        <div className="flex items-center space-x-2">
                            <Input
                                type="number"
                                placeholder="Size"
                                value={size}
                                onChange={(e) => setSize(e.target.value)}
                                className="bg-[#1e2329] border-none text-white"
                            />
                            <Select defaultValue="BTC">
                                <SelectTrigger className="w-[80px] bg-[#1e2329] border-none text-white">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-[#1e2329] text-white">
                                    <SelectItem value="BTC">BTC</SelectItem>
                                    <SelectItem value="ETH">ETH</SelectItem>
                                    <SelectItem value="BNB">BNB</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <Slider
                            value={sliderValue}
                            onValueChange={setSliderValue}
                            max={100}
                            step={25}
                            className="w-full"
                        />

                        <Button className="w-full bg-yellow-400 text-black font-semibold">Register Now</Button>
                        <Button className="w-full bg-[#2b3139] text-white">Log In</Button>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    )
}
